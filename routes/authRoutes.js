// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Маршрут для реєстрації
router.post('/register', registerUser);

// Маршрут для логіну
router.post('/login', loginUser);

// Валідація реєстрації
router.post(
  '/register',
  [
    check('name', "Ім'я обов'язкове").not().isEmpty(),
    check('email', 'Некоректний email').isEmail(),
    check('password', 'Пароль має бути мінімум 6 символів').isLength({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  registerUser
);

router.post('/login', loginUser);

module.exports = router;
