const express = require('express');
const router = express.Router();
// (अगर आपने Note नाम का मॉडल बनाया है तो उसे यहाँ इम्पोर्ट कर लें)
// const Note = require('../models/Note');

// नोट्स फेच करने का बैकएंड राउट
router.get('/', async (req, res) => {
  try {
    // const notes = await Note.find(); // डेटाबेस से नोट्स लाएं
    res.json({ success: true, notes: [] }); // अभी खाली अरे भेज रहे हैं ताकि 404 न आए
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;