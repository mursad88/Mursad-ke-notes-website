const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  photo: { type: String, required: true }, // फोटो का यूआरएल या पाथ
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);