const express = require('express');
const router = express.Router();
const { getUserDetails, updateUserDetails } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// GET route to fetch user details
router.get('/me', verifyToken, getUserDetails);
// PUT route to update user details
router.put('/me', verifyToken, updateUserDetails);

module.exports = router;