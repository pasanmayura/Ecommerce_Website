const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/addCategory', verifyToken, categoryController.addCategory);
router.get('/getCategories', categoryController.getCategories);
router.delete('/deleteCategory/:id', verifyToken, categoryController.deleteCategory); 

module.exports = router;