// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Підключаємось до MongoDB, використовуючи URI з .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Завершуємо процес при помилці
  }
};

module.exports = connectDB;
