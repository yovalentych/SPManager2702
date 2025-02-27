// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    affiliation: { type: String },
    position: { type: String },
    socialLinks: {
      googleScholar: { type: String },
      orcid: { type: String },
      linkedIn: { type: String },
    },
    contacts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['pending', 'accepted'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
