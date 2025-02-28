const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/addBatch', verifyToken, batchController.addBatch);
router.get('/getProductsID', verifyToken, batchController.getProductsID); 

module.exports = router;