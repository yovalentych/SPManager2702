// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    affiliation: { type: String }, // Університет або інституція
    position: { type: String }, // Посада
    socialLinks: {
      googleScholar: { type: String },
      orcid: { type: String },
      linkedIn: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
