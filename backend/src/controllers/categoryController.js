const pool = require('../config/db');

// add category
exports.addCategory = async (req, res) => {
  const { Category_Name } = req.body;
  const adminID = req.adminID;
  console.log('adminID:', adminID);

  if (!Category_Name) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(CategoryID, 3) AS UNSIGNED)) AS lastID FROM category";
    
    pool.query(getLastIDQuery, (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      const lastID = result[0].lastID || 0;
      const newID = `Ca${lastID + 1}`;

      const sql = 'INSERT INTO category (CategoryID, Category_Name, AdminID) VALUES (?, ?, ?)';

      pool.query(sql, [newID, Category_Name, adminID], (err, result) => {
        if (err) {
          console.error('Error inserting into database:', err);
          return res.status(500).json({ message: 'Database insert error' });
        }
        res.status(200).json({ message: 'Category added successfully' });
      });
  });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch categories
exports.getCategories = async (req, res) => {
  try {
    const sql = 'SELECT * FROM category';
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