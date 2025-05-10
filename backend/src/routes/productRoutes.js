const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/addProducts', verifyToken, productController.addProducts);
router.get('/getProducts', verifyToken, productController.getProducts);
router.delete('/deleteProduct/:id', verifyToken, productController.deleteProduct);
router.get('/getAttributes', verifyToken, productController.getAttributes);

module.exports = router;