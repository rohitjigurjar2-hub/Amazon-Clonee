/**
 * Amazon Clone REST API Backend Server
 * Built with Express, Node.js, JWT, and Persistent Storage
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { ensureDbExists } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Storage & Seeds
ensureDbExists();

// Middleware
app.use(cors({
  origin: '*', // Allows requests from https://amazon-frontend-1-8hxv.onrender.com & localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static directory if frontend build is included
app.use(express.static(path.join(__dirname, 'public')));

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Amazon Clone Backend REST API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      products: 'GET /api/products',
      categories: 'GET /api/products/categories',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      cart: 'GET /api/cart',
      orders: 'GET /api/orders/my-orders',
      payments: 'POST /api/payments/create-intent'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Amazon Clone Backend Service'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Amazon Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️ Products Endpoint: http://localhost:${PORT}/api/products`);
});
