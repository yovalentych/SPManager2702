const User = require('../models/User');

// Відправити запит у контакти
const sendContactRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const recipient = await User.findById(userId);

    if (!recipient) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Перевіряємо, чи запит вже існує
    const existingRequest = recipient.contacts.find(
      (contact) => contact.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'Запит уже відправлений або користувач у контактах' });
    }

    // Додаємо запит
    recipient.contacts.push({ user: req.user._id, status: 'pending' });
    await recipient.save();

    res.json({ message: 'Запит відправлено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Отримати список запитів
const getPendingRequests = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'contacts.user',
    'name email'
  );
  const pendingRequests = user.contacts.filter((c) => c.status === 'pending');
  res.json(pendingRequests);
};

// прийняти запит
const acceptContactRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Знаходимо запит у контакти
    const contactIndex = user.contacts.findIndex(
      (contact) =>
        contact.user.toString() === userId && contact.status === 'pending'
    );

    if (contactIndex === -1) {
      return res
        .status(400)
        .json({ message: 'Запит не знайдено або вже оброблено' });
    }

    // Оновлюємо статус контакту на "accepted"
    user.contacts[contactIndex].status = 'accepted';
    await user.save();

    // Також додаємо поточного користувача у контакти того, хто відправив запит
    const sender = await User.findById(userId);
    sender.contacts.push({ user: req.user._id, status: 'accepted' });
    await sender.save();

    res.json({ message: 'Запит прийнято, користувач доданий у контакти' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// можливість відхилити запит у контакти
const rejectContactRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Перевіряємо, чи є запит у списку контактів
    const contactIndex = user.contacts.findIndex(
      (contact) =>
        contact.user.toString() === userId && contact.status === 'pending'
    );

    if (contactIndex === -1) {
      return res
        .status(400)
        .json({ message: 'Запит не знайдено або вже оброблено' });
    }

    // Видаляємо запит
    user.contacts.splice(contactIndex, 1);
    await user.save();

    res.json({ message: 'Запит відхилено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// отримання даних контакту
const getContacts = async (req, res) => {
  try {
    // Отримуємо користувача та "розгортаємо" контакти
    const user = await User.findById(req.user._id).populate(
      'contacts.user',
      'name email affiliation position socialLinks'
    );

    // Вибираємо тільки підтверджені контакти (accepted)
    const friends = user.contacts.filter((c) => c.status === 'accepted');

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// видалення контакту
const removeContact = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    // Перевіряємо, чи є контакт
    const contactIndex = user.contacts.findIndex(
      (contact) =>
        contact.user.toString() === userId && contact.status === 'accepted'
    );

    if (contactIndex === -1) {
      return res.status(400).json({ message: 'Контакт не знайдено' });
    }

    // Видаляємо контакт
    user.contacts.splice(contactIndex, 1);
    await user.save();

    res.json({ message: 'Контакт видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = {
  sendContactRequest,
  getPendingRequests,
  rejectContactRequest,
  removeContact,
  acceptContactRequest,
  getContacts,
};
