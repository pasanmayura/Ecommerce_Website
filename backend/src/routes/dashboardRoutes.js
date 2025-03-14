const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getDashboardDetails', verifyToken, dashboardController.getDashboardDetails);
router.get('/getLowStockProducts', verifyToken, dashboardController.getLowStockProducts);
router.get('/getSalesChart', verifyToken, dashboardController.getSalesChart);

module.exports = router;