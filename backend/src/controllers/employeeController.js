const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Fetch categories
exports.getEmployee = async (req, res) => {
    try {
      const sql = 'SELECT * FROM admin';
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

// Register Employee
exports.registerEmp = async (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Password } = req.body;
  const role = req.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can register employees.' });
  }

  if (!FirstName || !LastName || !Email || !PhoneNumber || !Password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Find the next adminID
    const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(adminID, 3) AS UNSIGNED)) AS lastID FROM admin";
    
    pool.query(getLastIDQuery, (err, result) => {
      if (err) {
        console.error('Error fetching last adminID:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const lastID = result[0].lastID || 0; // If no ID exists, start from 0
      const nextID = `Ad${lastID + 1}`; // Generate the next adminID

      // Insert the new employee with the generated adminID
      const insertQuery = 'INSERT INTO admin (adminID, FirstName, LastName, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?, ?, ?)';
      pool.query(insertQuery, [nextID, FirstName, LastName, Email, PhoneNumber, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting into database:', err);
          return res.status(500).json({ message: 'Database insert error' });
        }
        res.status(200).json({ message: 'Employee registered successfully', adminID: nextID });
      });
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};