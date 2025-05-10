const pool = require('../config/dbpromise');

exports.addBatch = async (req, res) => {
  const { ProductID, StockQuantity, BuyingPrice, SellingPrice, AttributeQuantities } = req.body;

  if (!ProductID || !StockQuantity || !BuyingPrice || !SellingPrice) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // Start a transaction

    // Insert batch details into the Batch table
    const batchSql = `
      INSERT INTO batch (ProductID, Stock_Quantity, Buying_Price, Selling_Price)
      VALUES (?, ?, ?, ?)
    `;
    const [batchResult] = await connection.query(batchSql, [ProductID, StockQuantity, BuyingPrice, SellingPrice]);

    const BatchID = batchResult.insertId; // Get the newly inserted BatchID

    // Insert attribute quantities into the product_attributes_batch table
    const attributeBatchSql = `
      INSERT INTO product_attributes_batch (id_pa, BatchID, Quantity)
      VALUES (?, ?, ?)
    `;

    for (const [id_pa, quantity] of Object.entries(AttributeQuantities)) {
      if (quantity) {
        await connection.query(attributeBatchSql, [id_pa, BatchID, quantity]);
      }
    }

    await connection.commit(); // Commit the transaction
    res.status(200).json({ message: 'Batch added successfully' });
  } catch (error) {
    console.error('Error:', error);
    await connection.rollback(); // Rollback the transaction on error
    res.status(500).json({ message: 'Failed to add batch. Transaction rolled back.' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Fetch Products
exports.getProductsID = async (req, res) => {
  try {
    const sql = 'SELECT * FROM product';
    const [result] = await pool.query(sql); // Use promise-based query
    res.status(200).json(result); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' }); // Ensure the error response is JSON
  }
};

exports.getProductAttributes = async (req, res) => {
  const { productID } = req.params;

  try {
    const sql = `
      SELECT pa.id, pa.value AS value
      FROM product_attributes pa
      WHERE pa.ProductID = ?
    `;
    const [result] = await pool.query(sql, [productID]); // Use promise-based query
    res.status(200).json(result); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    res.status(500).json({ message: 'Server error' }); // Ensure the error response is JSON
  }
};