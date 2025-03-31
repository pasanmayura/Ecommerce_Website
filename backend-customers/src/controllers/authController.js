const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Import database connection
require('dotenv').config();

// Login User
exports.loginUser = async (req, res) => {
    const { Email, Password } = req.body;
  
    if (!Email || !Password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }
  
    try {
      const sql = 'SELECT * FROM customer WHERE Email = ?';
      pool.query(sql, [Email], async (err, result) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Database query error' });
        }
  
        if (result.length === 0) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        const customer = result[0]; // Get the first matching user     
  
        const isPasswordValid = await bcrypt.compare(Password, customer.Password);
  
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        const token = jwt.sign(
          {
            customerID: customer.CustomerID,          
            firstName: customer.FirstName,
            lastName: customer.LastName,
          },
          process.env.JWT_SECRET, // Use the secret from environment variables
          { expiresIn: '5h' }
        );
  
        res.status(200).json({ message: 'Login successful', token });
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };