const express = require('express');
const { submitReview } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addReview', verifyToken, submitReview);

module.exports = router;