const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');
const verifyToken = require('../middlewares/VerifyToken');

// Route to fetch inventory report
router.get('/inventory', verifyToken, reportController.getInventoryReport);
router.get('/sales', verifyToken, reportController.getSalesReport);

module.exports = router;