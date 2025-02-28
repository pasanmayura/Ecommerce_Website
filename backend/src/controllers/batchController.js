const pool = require('../config/db');

exports.addBatch = async (req, res) => {
  const { ProductID, StockQuantity, BuyingPrice, SellingPrice } = req.body;

  if (!ProductID || !StockQuantity || !BuyingPrice || !SellingPrice) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const sql = 'INSERT INTO batch (ProductID, Stock_Quantity, Buying_Price, Selling_Price) VALUES (?, ?, ?, ?)';
    pool.query(sql, [ProductID, StockQuantity, BuyingPrice, SellingPrice], (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ message: 'Database insert error' });
      }
      res.status(200).json({ message: 'Batch added successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Products
exports.getProductsID = async (req, res) => {
  try {
    const sql = 'SELECT * FROM product';
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
