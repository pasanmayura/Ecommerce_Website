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

exports.submitReturnRequest = async (req, res) => {
  const { orderId, returnItems } = req.body; // Extract orderId and return items from the request body
  const customerId = req.user.customerID; // Extract customer ID from the authenticated user

  try {
    // Generate the next OrderReturnID
    const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(OrderReturnID, 4) AS UNSIGNED)) AS lastID FROM Order_Returns";
    const [lastIDResult] = await db.query(getLastIDQuery);

    const lastID = lastIDResult[0]?.lastID || 0; // If no ID exists, start from 0
    const nextID = `ORR${lastID + 1}`; // Generate the next OrderReturnID

    // Insert a new return request into the Order_Returns table
    const insertReturnSql = `
      INSERT INTO Order_Returns (OrderReturnID, OrderID, CustomerID, ReturnStatus)
      VALUES (?, ?, ?, 'Pending')
    `;
    await db.query(insertReturnSql, [nextID, orderId, customerId]);

    // Insert return items into the Return_Items table
    const insertReturnItemsSql = `
      INSERT INTO Return_Items (OrderReturnID, ProductID, Quantity, Reason)
      VALUES ?
    `;
    const returnItemsData = returnItems.map(item => [
      nextID,
      item.productId,
      item.quantity,
      item.reason,
    ]);
    await db.query(insertReturnItemsSql, [returnItemsData]);

    res.status(200).json({ message: 'Return request submitted successfully', orderReturnID: nextID });
  } catch (error) {
    console.error('Error submitting return request:', error.message);
    res.status(500).json({ message: 'Failed to submit return request' });
  }
};