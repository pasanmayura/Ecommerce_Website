const express = require('express');
const router = express.Router();
const { updateUserAddress, placeOrder } = require('../controllers/orderController');
const { updatePaymentStatus } = require('../controllers/orderController');
const { getOrdersByCustomer } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

// PUT route to update user address
router.put('/update-address', verifyToken, updateUserAddress);
router.post('/place-order', verifyToken, placeOrder);
router.put('/update-payment-status', verifyToken, updatePaymentStatus);
router.get('/get-orders', verifyToken, getOrdersByCustomer);

module.exports = router;

