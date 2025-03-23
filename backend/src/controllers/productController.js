const pool = require('../config/db');
const { uploadFile, generatePublicUrl } = require('../config/googleDrive');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Limit to 3 files
const upload = multer({ storage: storage }).array('files', 3);

// add product
exports.addProducts= async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'File upload error' });
    }
    // console.log('Uploaded files:', req.files); // Log the uploaded files
    // console.log('Request body:', req.body);

    const { Product_Name, Description, Threshold, CategoryID } = req.body;
    const adminID = req.adminID;
    const files = req.files;
    const folderId = '15W1nusubkWsL154O0lLt1T8V3HmDC7m0';
  
    if (!Product_Name || !Description || !Threshold || !CategoryID) {
      return res.status(400).json({ message: 'All fields are aaa required!' });
    }
  
    try {
      const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(ProductID, 3) AS UNSIGNED)) AS lastID FROM product";
      
      pool.query(getLastIDQuery, (err, result) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Database query error' });
        }
  
        const lastID = result[0].lastID || 0;
        const newID = `Pr${lastID + 1}`;
  
        const sql = 'INSERT INTO product (ProductID, Product_Name, Description, Threshold, AdminID, CategoryID) VALUES (?, ?, ?, ?, ?, ?)';
  
        pool.query(sql, [newID, Product_Name, Description, Threshold, adminID, CategoryID], async(err, result) => {
          if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ message: 'Database insert error' });
          }

          // Upload images to Google Drive and store URLs in the database
          const imageUrls = [];
          for (const file of files) {
            const filePath = path.join(__dirname, '../../uploads/', file.filename);
            // console.log(`File path: ${filePath}`);
            const fileId = await uploadFile(filePath);
            const fileUrl = await generatePublicUrl(fileId);
            imageUrls.push(fileUrl);

            // Delete the local file after uploading
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting local file:', err);
              }
            });
          }

          // Ensure we have exactly 3 image URLs (fill with null if fewer)
          while (imageUrls.length < 3) {
            imageUrls.push(null);
          }

          const imageSql = `
            INSERT INTO productsimages (ProductID, ImageURL_1, ImageURL_2, ImageURL_3)
            VALUES (?, ?, ?, ?)
          `;
          pool.query(imageSql, [newID, imageUrls[0], imageUrls[1], imageUrls[2]], (err, result) => {
            if (err) {
              console.error('Error inserting image URLs into database:', err);
              return res.status(500).json({ message: 'Database insert error for images' });
            }
          
          res.status(200).json({ message: 'Product added successfully' });
        });
      });
    });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
    });
  };

// Fetch Products
  exports.getProducts = async (req, res) => {
    try {
      const sql = `SELECT p.ProductID, p.Product_Name, p.Description, p.Threshold, b.BatchID, b.Buying_Price, b.Selling_Price, b.Stock_Quantity 
                    FROM product p JOIN batch b ON p.ProductID = b.ProductID WHERE b.IsDeleted = b'0' `;
      pool.query(sql, (err, result) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Database query error' });
        }
        res.status(200).json(result);
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const markAsDeletedQuery = "UPDATE batch SET isDeleted = b'1' WHERE BatchID = ?";
    pool.query(markAsDeletedQuery, [id], (err, result) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).json({ message: 'Database update error' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// in product add page give the option to add multiple images with multiple file input fields
// according to that change product edit page to display multiple images
