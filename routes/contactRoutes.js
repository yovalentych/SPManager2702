const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  sendContactRequest,
  getPendingRequests,
  rejectContactRequest,
  removeContact,
  acceptContactRequest,
  getContacts,
} = require('../controllers/contactController');

const router = express.Router();

router.post('/send-request', protect, sendContactRequest); // Відправка запиту
router.get('/pending-requests', protect, getPendingRequests); // Отримання запитів
router.put('/accept-request', protect, acceptContactRequest); // Прийняття запитів
router.get('/friends', protect, getContacts); // Перегляд контактів
router.delete('/reject-request', protect, rejectContactRequest); // Відхилення запиту
router.delete('/remove-friend', protect, removeContact); // Видалення друга

module.exports = router;
