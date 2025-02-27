// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Реєстрація нового користувача
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевіряємо, чи існує користувач з таким email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email вже використовується' });
    }

    // Хешуємо пароль перед збереженням
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Логін користувача
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача за email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // Перевіряємо пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // Генеруємо JWT токен
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, userId: user._id, userName: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
