const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  sendContactRequest,
  getPendingRequests,
  rejectContactRequest,
  removeContact,
} = require('../controllers/contactController');

const router = express.Router();

router.post('/send-request', protect, sendContactRequest); // Відправка запиту
router.get('/pending-requests', protect, getPendingRequests); // Отримання запитів
router.delete('/reject-request', protect, rejectContactRequest); // Відхилення запиту
router.delete('/remove-friend', protect, removeContact); // Видалення друга

module.exports = router;
