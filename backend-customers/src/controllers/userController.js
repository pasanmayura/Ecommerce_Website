const db = require('../config/db'); 

// Controller to fetch user details
exports.getUserDetails = async (req, res) => {
  const userId = req.user.customerID; // Extract user ID from the JWT token

  try {
    // Query the database to fetch user details
    const sql = 'SELECT * FROM customer WHERE CustomerID = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the user details
      res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};