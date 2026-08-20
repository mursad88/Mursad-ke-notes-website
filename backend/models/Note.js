const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  content: { type: String },
  pdfFile: { type: String },    // मुख्य नोट्स PDF
  sampleFile: { type: String },  // फ्री सैंपल PDF
  validityDays: { type: Number, default: 365 }, // 👈 यह नया फील्ड जोड़ा है (डिफ़ॉल्ट 1 साल यानी 365 दिन रहेगा)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);