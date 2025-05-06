const pool = require('../config/db');

// Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const customerId = req.user.customerID; 

  try {
    const query = `
      INSERT INTO Wishlist (CustomerID, ProductID)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE ProductID = ProductID; -- Prevent duplicate entries
    `;
    await pool.promise().query(query, [customerId, productId]);

    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: 'Failed to add product to wishlist' });
  }
};

// Remove a product from the wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const customerId = req.user.customerID; 

  try {
    const query = `
      DELETE FROM Wishlist
      WHERE CustomerID = ? AND ProductID = ?
    `;
    await pool.promise().query(query, [customerId, productId]);

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove product from wishlist' });
  }
};

// Fetch the wishlist for a specific user
exports.getWishlist = async (req, res) => {
    const customerId = req.user.customerID; 
  
    try {
      const query = `
        SELECT 
          p.ProductID AS id,
          p.Product_Name AS name,
          p.Description AS description,
          p.Product_Rating AS rating,
          pi.ImageURL_1 AS image,
          CAST(MIN(b.Selling_Price) AS DECIMAL(10, 2)) AS price
        FROM Wishlist w
        JOIN product p ON w.ProductID = p.ProductID
        JOIN productsimages pi ON p.ProductID = pi.ProductID
        JOIN batch b ON p.ProductID = b.ProductID
        WHERE w.CustomerID = ?
        GROUP BY p.ProductID, pi.ImageURL_1, p.Product_Name, p.Description, p.Product_Rating;
      `;
      const [rows] = await pool.promise().query(query, [customerId]);
  
      res.status(200).json(rows); // Return detailed product information
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
  };

// Clear all items from the wishlist for a specific user
exports.clearWishlist = async (req, res) => {
    const customerId = req.user.customerID; // Extract customer ID from the token
  
    try {
      const query = `DELETE FROM Wishlist WHERE CustomerID = ?`;
      await pool.promise().query(query, [customerId]);
  
      res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      res.status(500).json({ message: 'Failed to clear wishlist' });
    }
  };