const db = require('../config/dbpromise');

exports.submitReview = async (req, res) => {
  const { productId, rating, comment, orderId } = req.body; // Include orderId in the request body
  const customerId = req.user.customerID; // Extract customer ID from the authenticated user

  try {
    // Insert the review into the product_review table
    const insertReviewSql = `
      INSERT INTO product_review (ProductID, CustomerID, CustomerRating, Comment)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(insertReviewSql, [productId, customerId, rating, comment]);

    // Update the Product table with the new average rating
    const updateProductSql = `
      UPDATE Product
      SET 
        Total_Rating = Total_Rating + ?,
        Rating_Count = Rating_Count + 1,
        Product_Rating = (Total_Rating + ?) / (Rating_Count + 1)
      WHERE ProductID = ?
    `;
    await db.query(updateProductSql, [rating, rating, productId]);

    const updateOrderStatusSql = `
      UPDATE Orders
      SET OrderStatus = 'Completed'
      WHERE OrderID = ? AND CustomerID = ?
    `;
    await db.query(updateOrderStatusSql, [orderId, customerId]);

    res.status(200).json({ message: 'Review submitted and order status updated successfully' });
  } catch (error) {
    console.error('Error submitting review:', error.message);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};