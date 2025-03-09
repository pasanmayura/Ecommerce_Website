const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const batchRoutes = require('./routes/batchRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/products', productRoutes);
app.use('/batch', batchRoutes);
app.use('/employee', employeeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/order', orderRoutes);

module.exports = app;
