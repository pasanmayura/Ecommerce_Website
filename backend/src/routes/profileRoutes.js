const express = require('express');
const { getProfile } = require('../controllers/profileController');
const verifyToken = require('../middlewares/VerifyToken');
const router = express.Router();

// Routes
router.get('/getProfile', verifyToken, getProfile);

module.exports = router;
