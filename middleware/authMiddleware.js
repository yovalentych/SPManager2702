// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Перевіряємо, чи передано токен у заголовках
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Виділяємо токен
      token = req.headers.authorization.split(' ')[1];

      // Розшифровуємо токен і отримуємо ID користувача
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Отримуємо користувача з БД (без пароля)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Неавторизований, невірний токен' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Неавторизований, токен відсутній' });
  }
};

module.exports = protect;
