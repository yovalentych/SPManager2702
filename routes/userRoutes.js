const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/userController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Отримання профілю (GET)
router.get('/profile', protect, getUserProfile);

// Оновлення профілю (PUT)
router.put('/profile', protect, updateUserProfile);

// Зміна пароля (PUT)
router.put('/password', protect, updateUserPassword);

// валідація в оновлення профілю
router.put(
  '/profile',
  protect,
  [
    check('name', "Ім'я не може бути порожнім").optional().not().isEmpty(),
    check('affiliation', 'Афіліація не може бути надто довгою')
      .optional()
      .isLength({ max: 100 }),
    check('position', 'Посада не може бути надто довгою')
      .optional()
      .isLength({ max: 100 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateUserProfile
);

router.put(
  '/password',
  protect,
  [
    check('oldPassword', 'Введіть старий пароль').not().isEmpty(),
    check('newPassword', 'Новий пароль має бути мінімум 6 символів').isLength({
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
  updateUserPassword
);

module.exports = router;
