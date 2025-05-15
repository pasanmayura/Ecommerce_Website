const express = require('express');
const router = express.Router();
const { updateUserAddress } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

// PUT route to update user address
router.put('/update-address', verifyToken, updateUserAddress);

module.exports = router;

