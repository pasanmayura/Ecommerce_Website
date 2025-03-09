const express = require('express');
const router = express.Router();
const { getOrders, viewOrderbyId }= require('../controllers/orderController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getOrders', verifyToken, getOrders);
router.get('/viewOrderbyId/:id', verifyToken, viewOrderbyId);

module.exports = router;