const express = require('express');
const router = express.Router();
const { getOrders, viewOrderbyId, updateOrderStatus, getOrderReturns, viewOrderReturnById, updateOrderReturnStatus } = require('../controllers/orderController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getOrders', verifyToken, getOrders);
router.get('/viewOrderbyId/:id', verifyToken, viewOrderbyId);
router.put('/updateOrderStatus/:orderId', verifyToken, updateOrderStatus);
router.get('/getOrderReturns', verifyToken, getOrderReturns);
router.get('/viewOrderReturnById/:id', verifyToken, viewOrderReturnById);
router.put('/updateOrderReturnStatus/:orderReturnId', verifyToken, updateOrderReturnStatus);

module.exports = router;