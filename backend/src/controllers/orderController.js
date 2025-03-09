const pool = require('../config/db');

exports.getOrders = async (req, res) => {
    try {
        const sql = 'SELECT * FROM orders';
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

exports.viewOrderbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT c.FirstName, c.LastName, c.Email, c.MobileNumber, c.Street_No, c.Village, c.city, c.Postal_Code,
                    p.ProductID, b.BatchID, po.Quantity, o.OrderStatus, o.PaymentStatus
                    FROM 
                        Customer c 
                    JOIN 
                        Orders o ON c.CustomerID = o.CustomerID 
                    JOIN 
                        ProductOrders po ON o.OrderID = po.OrderID
                    JOIN 
                        Product p ON po.ProductID = p.ProductID
                    JOIN 
                        Batch b ON po.BatchID = b.BatchID
                    WHERE 
                        o.OrderID = ?`;
        pool.query(sql, [id], (err, result) => {
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