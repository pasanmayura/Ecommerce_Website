const pool = require('../config/dbpromise');
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
exports.addProducts = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'File upload error' });
    }

    const { Product_Name, Description, Threshold, CategoryID, Attributes } = req.body;
    const adminID = req.adminID;
    const files = req.files;

    if (!Product_Name || !Description || !Threshold || !CategoryID) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
      await connection.beginTransaction(); // Start a transaction

      // Generate new ProductID
      const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(ProductID, 3) AS UNSIGNED)) AS lastID FROM product";
      const [lastIDResult] = await connection.query(getLastIDQuery);
      const lastID = lastIDResult[0].lastID || 0;
      const newID = `Pr${lastID + 1}`;

      // Insert into product table
      const productSql = 'INSERT INTO product (ProductID, Product_Name, Description, Threshold, AdminID, CategoryID) VALUES (?, ?, ?, ?, ?, ?)';
      await connection.query(productSql, [newID, Product_Name, Description, Threshold, adminID, CategoryID]);

      // Upload images to Google Drive and store URLs in the database
      const imageUrls = [];
      for (const file of files) {
        const filePath = path.join(__dirname, '../../uploads/', file.filename);
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

      // Insert into productsimages table
      const imageSql = `
        INSERT INTO productsimages (ProductID, ImageURL_1, ImageURL_2, ImageURL_3)
        VALUES (?, ?, ?, ?)
      `;
      await connection.query(imageSql, [newID, imageUrls[0], imageUrls[1], imageUrls[2]]);

      // Insert attributes into product_attributes table
      const attributes = JSON.parse(Attributes || '[]'); // Parse the attributes JSON string, default to an empty array if undefined or null
      if (attributes.length > 0) {
        const attributeSql = `
          INSERT INTO product_attributes (ProductID, attribute_id, value)
          VALUES (?, ?, ?)
        `;
        for (const attr of attributes) {
          if (!attr.attribute || !attr.value) {
            continue; // Skip if attribute_id or value is empty
          }
          await connection.query(attributeSql, [newID, attr.attribute, attr.value]);
        }
      }

      await connection.commit(); // Commit the transaction
      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error:', error);
      await connection.rollback(); // Rollback the transaction on error
      res.status(500).json({ message: 'Failed to add product. Transaction rolled back.' });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  });
};

// Fetch Products
  exports.getProducts = async (req, res) => {
    try {
      const sql = `SELECT p.ProductID, p.Product_Name, p.Description, p.Threshold, b.BatchID, b.Buying_Price, b.Selling_Price, b.Stock_Quantity 
                    FROM product p JOIN batch b ON p.ProductID = b.ProductID WHERE b.IsDeleted = b'0' `;
      const [result] = await pool.query(sql);
      res.status(200).json(result);
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
    const [result] = await pool.query(markAsDeletedQuery, [id]); // Use promise-based query
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error updating database:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch attributes
exports.getAttributes = async (req, res) => {
  try {
    const sql = 'SELECT * FROM attributes';
    const [result] = await pool.query(sql); // Use promise-based query
    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
