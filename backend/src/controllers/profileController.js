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

// Update User Profile
exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
  const { FirstName, LastName, PhoneNumber } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const adminId = decoded.adminID; 

    if (!adminId) {
      return res.status(400).json({ message: 'Invalid token: AdminID not found' });
    }

    const sql = 'UPDATE admin SET FirstName = ?, LastName = ?, PhoneNumber = ? WHERE AdminID = ?';
    pool.query(sql, [FirstName, LastName, PhoneNumber, adminId], (err, result) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).json({ message: 'Database update error' });
      }

      res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User Account
exports.deleteAccount = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    const adminId = decoded.adminID; // Get the AdminID from the decoded token

    if (!adminId) {
      return res.status(400).json({ message: 'Invalid token: AdminID not found' });
    }

    const sql = 'DELETE FROM admin WHERE AdminID = ?';
    pool.query(sql, [adminId], (err, result) => {
      if (err) {
        console.error('Error deleting from database:', err);
        return res.status(500).json({ message: 'Database delete error' });
      }

      res.status(200).json({ message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change User Password
exports.changePassword = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
  const { currentPassword, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const adminId = decoded.adminID; 

    if (!adminId) {
      return res.status(400).json({ message: 'Invalid token: AdminID not found' });
    }

    const sql = 'SELECT Password FROM admin WHERE AdminID = ?';
    pool.query(sql, [adminId], async (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(currentPassword, user.Password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = 'UPDATE admin SET Password = ? WHERE AdminID = ?';
      pool.query(updateSql, [hashedPassword, adminId], (err, result) => {
        if (err) {
          console.error('Error updating database:', err);
          return res.status(500).json({ message: 'Database update error' });
        }

        res.status(200).json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};