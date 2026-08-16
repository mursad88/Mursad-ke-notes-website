const mongoose = require('mongoose');

// छात्र के डेटा का ढांचा (Schema)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // इससे एक ईमेल आईडी से सिर्फ एक ही अकाउंट बन पाएगा
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // timestamps से यह पता चलेगा कि अकाउंट किस दिन और किस समय बना था

module.exports = mongoose.model('User', userSchema);