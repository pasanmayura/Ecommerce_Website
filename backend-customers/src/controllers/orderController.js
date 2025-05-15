const db = require('../config/db');
const bcrypt = require('bcryptjs'); 

exports.updateUserAddress = async (req, res) => {
    const userId = req.user.customerID; // Extract user ID from the JWT token
    const { Street_No, Village, City, Postal_Code } = req.body; // Extract updated details from request body
  
    try {
      // Validate request data
      if (!Street_No || !Village || !City || !Postal_Code) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Update the user details in the database
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