const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// POST route to handle contact form submissions
router.post('/submit', submitContactForm);

module.exports = router;