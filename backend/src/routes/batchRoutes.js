const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/addBatch', verifyToken, batchController.addBatch);
router.get('/getProductsID', verifyToken, batchController.getProductsID);
router.get('/product-attributes/:productID', verifyToken, batchController.getProductAttributes); 

module.exports = router;