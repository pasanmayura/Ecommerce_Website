const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route to fetch product cards
router.get('/getProductCards', productController.getProductCards);
router.get('/search', productController.searchProducts);
router.get('/category', productController.getProductsByCategory);
router.get('/details/:id', productController.getProductDetails);

module.exports = router;