const pool = require('../config/dbpromise');

// Fetch Inventory Report
exports.getInventoryReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.ProductID,
        p.Product_Name,
        p.Description,
        p.Threshold,
        p.CategoryID,
        c.Category_Name,
        b.Stock_Quantity,
        b.Buying_Price,
        b.Selling_Price,
        b.BatchID
      FROM Product p
      LEFT JOIN Category c ON p.CategoryID = c.CategoryID
      LEFT JOIN Batch b ON p.ProductID = b.ProductID;
    `;

    const [rows] = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ message: 'Failed to fetch inventory report.' });
  }
};

// Fetch Sales Report
exports.getSalesReport = async (req, res) => {
  try {
    const { timeframe } = req.query; // Get timeframe from query parameters
    console.log('Received Timeframe:', timeframe);

    // Determine the date format and grouping based on the timeframe
    let dateFormat = '%Y-%m'; // Default to monthly
    if (timeframe === 'Yearly') {
      dateFormat = '%Y'; // Group by year for yearly timeframe
    }
    if (timeframe === 'Daily') {
      dateFormat = '%Y-%m-%d'; // Group by year for yearly timeframe
    }

    // Query 1: Sales and orders
    const [salesData] = await pool.query(`
      SELECT  
        DATE_FORMAT(OrderDate, '${dateFormat}') AS period,
        SUM(Total_Amount) AS totalSales,
        COUNT(OrderID) AS orders
      FROM Orders
      GROUP BY period
    `);

    // Query 2: Products sold
    const [productData] = await pool.query(`
      SELECT  
        DATE_FORMAT(o.OrderDate, '${dateFormat}') AS period,
        SUM(po.Quantity) AS productsSold
      FROM Orders o
      JOIN ProductOrders po ON o.OrderID = po.OrderID
      GROUP BY period
    `);

    // Query 3: Top product
    const [topProductData] = await pool.query(`
      SELECT
        sub.period,
        sub.Product_Name AS topProduct
      FROM (
        SELECT  
          DATE_FORMAT(o.OrderDate, '${dateFormat}') AS period,
          p.Product_Name,
          SUM(po.Quantity) AS totalSold,
          RANK() OVER (PARTITION BY DATE_FORMAT(o.OrderDate, '${dateFormat}') ORDER BY SUM(po.Quantity) DESC) AS rankInPeriod
        FROM Orders o
        JOIN ProductOrders po ON o.OrderID = po.OrderID
        JOIN Product p ON p.ProductID = po.ProductID
        GROUP BY DATE_FORMAT(o.OrderDate, '${dateFormat}'), p.ProductID
      ) AS sub
      WHERE sub.rankInPeriod = 1
    `);

    // Combine all results
    const report = salesData.map(sale => {
      const product = productData.find(p => p.period === sale.period);
      const top = topProductData.find(t => t.period === sale.period);

      return {
        ...sale,
        productsSold: product ? product.productsSold : 0,
        topProduct: top ? top.topProduct : 'N/A'
      };
    });

    res.status(200).json({ salesData: report });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    res.status(500).json({ message: 'Failed to fetch sales report.' });
  }
};

