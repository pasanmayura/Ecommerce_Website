const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Route to fetch product cards
router.get('/getProductCards', productController.getProductCards);
router.get('/search', productController.searchProducts);

module.exports = router;