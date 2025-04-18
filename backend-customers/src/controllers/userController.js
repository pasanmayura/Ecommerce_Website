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

// Controller to update user details
exports.updateUserDetails = async (req, res) => {
    const userId = req.user.customerID; // Extract user ID from the JWT token
    const { FirstName, LastName, MobileNumber, Street_No, Village, City, Postal_Code } = req.body; // Extract updated details from request body
  
    try {
      // Validate request data
      if (!FirstName || !LastName || !MobileNumber || !Street_No || !Village || !City || !Postal_Code) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Update the user details in the database
      const sql = `
        UPDATE customer 
        SET FirstName = ?, LastName = ?, MobileNumber = ?, Street_No = ?, Village = ?, City = ?, Postal_Code = ?
        WHERE CustomerID = ?
      `;
      
      db.query(sql, [FirstName, LastName, MobileNumber, Street_No, Village, City, Postal_Code, userId], (err, result) => {
        if (err) {
          console.error('Error updating user details:', err);
          return res.status(500).json({ message: 'Database update error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({ message: 'User details updated successfully' });
      });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };