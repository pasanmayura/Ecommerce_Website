const db = require('../config/db');
const pool = require('../config/dbpromise'); 
const bcrypt = require('bcryptjs'); 

exports.updateUserAddress = async (req, res) => {
    const userId = req.user.customerID; 
    const { Street_No, Village, City, Postal_Code } = req.body; 
  
    try {
      if (!Street_No || !Village || !City || !Postal_Code) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const sql = `
        UPDATE customer 
        SET Street_No = ?, Village = ?, City = ?, Postal_Code = ?
        WHERE CustomerID = ?
      `;

      db.query(sql, [Street_No, Village, City, Postal_Code, userId], (err, result) => {
        if (err) {
          console.error('Error updating user details:', err);
          return res.status(500).json({ message: 'Database update error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({ message: 'User Address updated successfully' });
      });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.placeOrder = async (req, res) => {
    const userId = req.user.customerID; 
    const { items, totalAmount, paymentMethod } = req.body;  
  
    const connection = await pool.getConnection(); 
  
    try {
      await connection.beginTransaction(); 
  
      // Generate a unique OrderID
      const orderId = `ORD-${Date.now()}`;
  
      const orderSql = `
        INSERT INTO orders (OrderID, Total_Amount, PaymentStatus, PaymentMethod, OrderStatus, CustomerID)
        VALUES (?, ?, 'Pending', ?, 'Pending', ?)
      `;
      await connection.query(orderSql, [orderId, totalAmount, paymentMethod, userId]);
  
      const productOrdersData = [];
      for (const item of items) {
        const batchSql = `
          SELECT BatchID, Stock_Quantity FROM batch
          WHERE ProductID = ? AND Selling_Price = ?
          LIMIT 1
        `;
        const [batchResult] = await connection.query(batchSql, [item.productId, item.price]);
  
        if (batchResult.length === 0) {
          throw new Error(`Batch not found for ProductID: ${item.productId} and SellingPrice: ${item.price}`);
        }
  
        const batchId = batchResult[0].BatchID;
        const stockQuantity = batchResult[0].Stock_Quantity;
  
        if (stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ProductID: ${item.productId}`);
        }
  
        productOrdersData.push([orderId, item.productId, batchId, item.quantity]);
  
        // Reduce stock quantity
        const updateStockSql = `
          UPDATE batch
          SET Stock_Quantity = Stock_Quantity - ?
          WHERE BatchID = ?
        `;
        await connection.query(updateStockSql, [item.quantity, batchId]);
      }
  
      const productOrdersSql = `
        INSERT INTO productorders (OrderID, ProductID, BatchID, Quantity)
        VALUES ?
      `;
      await connection.query(productOrdersSql, [productOrdersData]);
  
      await connection.commit();
  
      res.status(200).json({ message: 'Order placed successfully', orderId });
  
      // Set a timeout to check payment status
      setTimeout(async () => {
        try {
          const [orderStatusResult] = await connection.query(
            `SELECT PaymentStatus, PaymentMethod FROM orders WHERE OrderID = ?`,
            [orderId]
          );
  
          if (orderStatusResult[0].PaymentStatus === 'Pending' && orderStatusResult[0].PaymentMethod === 'stripe') {
            // Rollback the order if payment is not completed
            console.log(`Rolling back order ${orderId} due to incomplete payment.`);
            await connection.beginTransaction();
  
            // Restore stock quantities
            for (const [orderId, productId, batchId, quantity] of productOrdersData) {
              const restoreStockSql = `
                UPDATE batch
                SET Stock_Quantity = Stock_Quantity + ?
                WHERE BatchID = ?
              `;
              const restoreResult = await connection.query(restoreStockSql, [quantity, batchId]);
              console.log(`Restored stock for BatchID ${batchId}:`, restoreResult);
            }
  
            const cancelOrderSql = `
              UPDATE orders
              SET OrderStatus = 'Cancelled',
                  PaymentStatus = 'Cancelled'
              WHERE OrderID = ?
            `;
            const cancelResult = await connection.query(cancelOrderSql, [orderId]);
            console.log(`Order ${orderId} status updated to Cancelled:`, cancelResult);
  
            await connection.commit();
            console.log(`Order ${orderId} has been rolled back due to incomplete payment.`);
          }
        } catch (timeoutError) {
          console.error('Error during rollback:', timeoutError.message);
          await connection.rollback();
        }
      }, 10 * 60 * 1000); // 10 minute timeout
    } catch (error) {
      await connection.rollback(); // Rollback the transaction on error
      console.error('Error placing order:', error.message);
      res.status(500).json({ message: error.message });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  };

  exports.updatePaymentStatus = async (req, res) => {
    const { orderId } = req.body;
  
    try {
      const sql = `
        UPDATE orders
        SET PaymentStatus = 'Paid'
        WHERE OrderID = ?
      `;
  
      db.query(sql, [orderId], (err, result) => {
        if (err) {
          console.error('Error updating payment status:', err);
          return res.status(500).json({ message: 'Database update error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Order not found' });
        }
  
        res.status(200).json({ message: 'Payment status updated to Paid' });
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getOrdersByCustomer = async (req, res) => {
    const customerId = req.user.customerID; // Extract CustomerID from the JWT token
  
    try {
      const sql = `
        SELECT 
          o.OrderID AS id,
          o.OrderDate AS date,
          o.OrderStatus AS status,
          CAST(o.Total_Amount AS DECIMAL(10, 2)) AS total, -- Ensure total is a number
          o.PaymentStatus AS paymentStatus,
          o.PaymentMethod AS paymentMethod,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', po.ProductID,
              'name', p.Product_Name,
              'price', po.Quantity * b.Selling_Price,
              'quantity', po.Quantity,
              'image', pi.ImageURL_1
            )
          ) AS products
        FROM orders o
        JOIN productorders po ON o.OrderID = po.OrderID
        JOIN product p ON po.ProductID = p.ProductID
        JOIN batch b ON po.BatchID = b.BatchID
        LEFT JOIN productsimages pi ON p.ProductID = pi.ProductID
        WHERE o.CustomerID = ?
        GROUP BY o.OrderID
        ORDER BY o.OrderDate DESC
      `;
  
      const [orders] = await pool.query(sql, [customerId]);
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };