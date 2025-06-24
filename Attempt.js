const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: Number,
  total: Number,
  percentage: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);