const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/addProducts', verifyToken, productController.addProducts);
router.get('/getProducts', verifyToken, productController.getProducts);

module.exports = router;