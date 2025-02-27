// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Маршрут для реєстрації
router.post('/register', registerUser);

// Маршрут для логіну
router.post('/login', loginUser);

module.exports = router;
