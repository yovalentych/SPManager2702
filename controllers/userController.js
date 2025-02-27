const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Отримання профілю
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Оновлення профілю
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Дозволяємо змінювати тільки ці поля
    if (req.body.name) user.name = req.body.name;
    if (req.body.affiliation) user.affiliation = req.body.affiliation;
    if (req.body.position) user.position = req.body.position;
    if (req.body.socialLinks) user.socialLinks = req.body.socialLinks;

    // Зберігаємо зміни
    const updatedUser = await user.save();

    res.json({
      message: 'Профіль оновлено',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        affiliation: updatedUser.affiliation,
        position: updatedUser.position,
        socialLinks: updatedUser.socialLinks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// функція зміни пароля
const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Перевіряємо старий пароль
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Старий пароль невірний' });
    }

    // Хешуємо новий пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: 'Пароль успішно змінено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, updateUserPassword };
