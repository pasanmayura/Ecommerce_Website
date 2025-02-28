const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/getEmployee', employeeController.getEmployee);
router.post('/registerEmp', verifyToken, employeeController.registerEmp);

module.exports = router;