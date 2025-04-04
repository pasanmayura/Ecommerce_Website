const express = require('express');
const { loginUser, registerUser, verifyEmailCode } = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/verify-email', verifyEmailCode);

module.exports = router;