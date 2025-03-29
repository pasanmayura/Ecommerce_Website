const pool = require('../config/db');

exports.getProductCards = async () => {
  try {
    const query = `
      SELECT 
        p.Product_Name AS name, 
        MIN(b.Selling_Price) AS price, 
        pi.ImageURL_1 AS image
      FROM product p
      JOIN batch b ON p.ProductID = b.ProductID
      JOIN productsimages pi ON p.ProductID = pi.ProductID
      GROUP BY p.ProductID, p.Product_Name, pi.ImageURL_1;
    `;
    const [rows] = await pool.promise().query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching product cards from database:', error);
    throw error;
  }
};