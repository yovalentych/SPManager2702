// index.js
require('dotenv').config(); // Підключаємо змінні середовища з .env
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Підключаємо MongoDB
connectDB();

// Вбудовані middleware для обробки JSON
app.use(express.json());
app.use(cors());

// підключення маршруту
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Запускаємо сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
