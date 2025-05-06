const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middlewares/authMiddleware'); 

// Routes for wishlist functionality
router.post('/add', verifyToken, wishlistController.addToWishlist); 
router.post('/remove', verifyToken, wishlistController.removeFromWishlist); 
router.get('/getWishlist', verifyToken, wishlistController.getWishlist); 

module.exports = router;