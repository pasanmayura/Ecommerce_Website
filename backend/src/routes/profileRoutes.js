const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Routes
router.get('/getProfile', verifyToken, getProfile);
router.put('/updateProfile', verifyToken, updateProfile);
router.delete('/deleteAccount', verifyToken, deleteAccount);

module.exports = router;
