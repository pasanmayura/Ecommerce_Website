const pool = require('../config/db');

// get dashboard data
exports.getDashboardDetails = async (req, res) => {
  try {
    const sql = `SELECT 
                COUNT(CASE WHEN OrderStatus = 'Shipped' THEN 1 END) AS ShippedOrders,  
                COUNT(CASE WHEN OrderStatus = 'Pending' THEN 1 END) AS PendingOrders,
                SUM(CASE WHEN PaymentStatus = 'Paid' THEN Total_Amount ELSE 0 END) AS TotalRevenue,
                (SELECT COUNT(*) FROM Customer) AS TotalCustomers,
                (SELECT COUNT(*) FROM Product) AS TotalProducts,
                (SELECT COUNT(*) FROM order_returns WHERE ReturnStatus = 'Pending') AS PendingOrderReturns,
                (SELECT COUNT(*) FROM LowStockProducts) AS NoOfLowStockProducts
                FROM Orders`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }
      res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};