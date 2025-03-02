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
      return res.status(500).json({ message: 'File upload error' });
    }

    const { Product_Name, Description, Threshold, CategoryID } = req.body;
    const adminID = req.adminID;
    const files = req.files;
    const folderId = '15W1nusubkWsL154O0lLt1T8V3HmDC7m0';
  
    if (!Product_Name || !Description || !Threshold || !CategoryID) {
      return res.status(400).json({ message: 'All fields are required!' });
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
          for (const file of files) {
            const filePath = path.join(__dirname, '../../uploads/', file.filename);
            const fileId = await uploadFile(filePath);
            const fileUrl = await generatePublicUrl(fileId);

            const imageSql = 'INSERT INTO ProductsImages (ProductID, ImageURL_1) VALUES (?, ?)';
            pool.query(imageSql, [newID, fileUrl], (err, result) => {
              if (err) {
                console.error('Error inserting image URL into database:', err);
              }
            });

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting local file:', err);
              }
            });
          }
          
          res.status(200).json({ message: 'Product added successfully' });
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
                    FROM product p JOIN batch b ON p.ProductID = b.ProductID`;
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