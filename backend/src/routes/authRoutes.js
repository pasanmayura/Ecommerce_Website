const express = require('express');
const { register, login, loginAdmin } = require('../controllers/authController');
const verifyToken = require('../middlewares/VerifyToken');
const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);

router.post('/loginAdmin', loginAdmin);

module.exports = router;
