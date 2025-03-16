const pool = require('../config/db');

// get dashboard data
exports.getDashboardDetails = async (req, res) => {
  try {
    const sql = `SELECT  
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

// get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const sql = `SELECT * FROM LowStockProducts`;
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

// sales chart 
exports.getSalesChart = async (req, res) => {
  try {

    const sql = `
      WITH DateSeries AS (
        SELECT CURDATE() - INTERVAL n DAY AS Date
        FROM (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
                      SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
                      SELECT 6) AS numbers
      )
      SELECT ds.Date AS date, COALESCE(SUM(o.Total_Amount), 0) AS total
      FROM DateSeries ds
      LEFT JOIN Orders o ON DATE(o.OrderDate) = ds.Date
      AND o.PaymentStatus = 'Paid'
      GROUP BY ds.Date
      ORDER BY ds.Date;
    `;
    

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