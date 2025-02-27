const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/userController');

const router = express.Router();

// Отримання профілю (GET)
router.get('/profile', protect, getUserProfile);

// Оновлення профілю (PUT)
router.put('/profile', protect, updateUserProfile);

// Зміна пароля (PUT)
router.put('/password', protect, updateUserPassword);

module.exports = router;
