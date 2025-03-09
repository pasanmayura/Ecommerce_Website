const express = require('express');
const router = express.Router();
const { getOrders, viewOrderbyId, updateOrderStatus, getOrderReturns }= require('../controllers/orderController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getOrders', verifyToken, getOrders);
router.get('/viewOrderbyId/:id', verifyToken, viewOrderbyId);
router.put('/updateOrderStatus/:orderId', verifyToken, updateOrderStatus);
router.get('/getOrderReturns', verifyToken, getOrderReturns);

module.exports = router;