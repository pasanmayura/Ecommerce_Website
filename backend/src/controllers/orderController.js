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
