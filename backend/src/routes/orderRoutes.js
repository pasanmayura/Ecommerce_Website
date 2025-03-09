const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getOrders', verifyToken, orderController.getOrders);

module.exports = router;