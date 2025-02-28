const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Token:', token); // Log the token for debugging

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    console.log('Decoded:', decoded); // Log the decoded token for debugging
    req.adminID = decoded.adminID;
    req.role = decoded.role; 
    next();
  });
};

module.exports = verifyToken;