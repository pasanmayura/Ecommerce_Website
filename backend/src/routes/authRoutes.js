const express = require('express');
const { loginAdmin } = require('../controllers/authController');
const verifyToken = require('../middlewares/VerifyToken');
const router = express.Router();

// Routes
router.post('/loginAdmin', loginAdmin);

module.exports = router;
