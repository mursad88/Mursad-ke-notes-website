const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  content: { type: String },
  pdfFile: { type: String },     // मुख्य नोट्स PDF
  sampleFile: { type: String },  // फ्री सैंपल PDF
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);