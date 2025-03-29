const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Route to fetch product cards
router.get('/getProductCards', productController.getProductCards);

module.exports = router;