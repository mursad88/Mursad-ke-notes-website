const express = require('express');
const router = express.Router();
const Note = require('../models/Note'); // आपका नोट्स मॉडल

// 1. सभी नोट्स देखने के लिए GET राउट
router.get('/', async (routerReq, res) => {
  try {
    const notes = await Note.find(); // डेटाबेस से सारे नोट्स ला रहे हैं
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. नए नोट्स अपलोड करने के लिए POST राउट (जो पहले नहीं था)
router.post('/upload', async (routerReq, res) => {
  try {
    const { title, category, sampleFile } = routerReq.body;

    const newNote = new Note({
      title,
      category,
      sampleFile
    });

    await newNote.save();
    res.json({ success: true, message: "नोट्स सफलता से अपलोड हो गया है!" });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;