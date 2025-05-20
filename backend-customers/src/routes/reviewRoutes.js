const express = require('express');
const { submitReview, submitReturnRequest } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addReview', verifyToken, submitReview);
router.post('/submitReturn', verifyToken, submitReturnRequest);

module.exports = router;