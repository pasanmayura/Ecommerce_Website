const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Import database connection
require('dotenv').config();

// Get User Profile
exports.getProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    const adminId = decoded.adminID; // Get the AdminID from the decoded token

    if (!adminId) {
      return res.status(400).json({ message: 'Invalid token: AdminID not found' });
    }

    const sql = 'SELECT FirstName, LastName, Email, PhoneNumber, Role FROM admin WHERE AdminID = ?';
    pool.query(sql, [adminId], (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }
      console.log("DB Query Result:", result); 
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];
      res.status(200).json({ user });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};