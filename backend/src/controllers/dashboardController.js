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
    const { period } = req.query;
    let sql = '';

    if (period === 'week') {
      sql = `SELECT DATE(OrderDate) AS date, SUM(Total_Amount) AS total 
            FROM Orders 
            WHERE OrderDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() 
            GROUP BY DATE(OrderDate)`;
    } else if (period === 'month') {
      sql = `SELECT DATE(OrderDate) AS date, SUM(Total_Amount) AS total 
            FROM Orders 
            WHERE OrderDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE() 
            GROUP BY DATE(OrderDate)`;
    } else if (period === 'year') {
      sql = `SELECT DATE(OrderDate) AS date, SUM(Total_Amount) AS total 
            FROM Orders 
            WHERE OrderDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 365 DAY) AND CURDATE() 
            GROUP BY DATE(OrderDate)`;
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }

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