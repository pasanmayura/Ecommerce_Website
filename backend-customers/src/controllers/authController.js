const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('../config/db'); // Import database connection
require('dotenv').config();

const verificationCodes = {};

exports.registerUser = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  if (!FirstName || !LastName || !Email || !Password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Check if email already exists
    const sql = 'SELECT * FROM customer WHERE Email = ?';
    pool.query(sql, [Email], async (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      verificationCodes[Email] = verificationCode; // Store the code temporarily

      // Send the verification code to the user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: Email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          console.log('EMAIL_USER:', process.env.EMAIL_USER);
          console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
          return res.status(500).json({ message: 'Error sending verification email' });
          
        }

        res.status(200).json({ success: true, message: 'Verification code sent to your email' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmailCode = async (req, res) => {
  const { Email, Code, FirstName, LastName, Password } = req.body;

  if (!Email || !Code || !FirstName || !LastName || !Password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Check if the code matches
    if (verificationCodes[Email] && verificationCodes[Email] === parseInt(Code)) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Generate the next CustomerID
      const getLastIDQuery = "SELECT MAX(CAST(SUBSTRING(CustomerID, 3) AS UNSIGNED)) AS lastID FROM customer";
      pool.query(getLastIDQuery, (err, result) => {
        if (err) {
          console.error('Error fetching last customerID:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        const lastID = result[0].lastID || 0; // If no ID exists, start from 0
        const nextID = `Cu${lastID + 1}`; // Generate the next CustomerID

        // Insert the new customer
        const insertQuery = 'INSERT INTO customer (CustomerID, FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?, ?)';
        pool.query(insertQuery, [nextID, FirstName, LastName, Email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ message: 'Database insert error' });
          }

          // Remove the verification code after successful registration
          delete verificationCodes[Email];

          res.status(200).json({ success: true, message: 'Customer registered successfully', customerID: nextID });
        });
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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