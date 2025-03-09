const express = require('express');
const { getProfile, updateProfile, deleteAccount, changePassword } = require('../controllers/profileController');
const verifyToken = require('../middlewares/VerifyToken');
const router = express.Router();

// Routes
router.get('/getProfile', verifyToken, getProfile);
router.put('/updateProfile', verifyToken, updateProfile);
router.delete('/deleteAccount', verifyToken, deleteAccount);
router.put('/changePassword', verifyToken, changePassword);

module.exports = router;
