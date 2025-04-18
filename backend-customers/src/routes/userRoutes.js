const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// GET route to fetch user details
router.get('/me', verifyToken, getUserDetails);

module.exports = router;