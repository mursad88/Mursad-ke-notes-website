const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// 1. सभी नोट्स देखने के लिए GET राउट
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Fetch Notes Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. नए नोट्स अपलोड करने के लिए POST राउट (लॉग के साथ)
router.post('/upload', async (req, res) => {
  try {
    console.log("📥 फ्रंटएंड से आया हुआ डेटा:", req.body); // यह Render के लॉग्स में दिखेगा

    const { title, category, price, description, sampleFile, pdfFile } = req.body;

    const newNote = new Note({
      title: title || "Test Note",
      category: category || "General",
      price: price || 0,
      description: description || "Test Description",
      sampleFile: sampleFile || "",
      pdfFile: pdfFile || ""
    });

    await newNote.save();
    res.json({ success: true, message: "नोट्स सफलता से अपलोड हो गया है!" });
  } catch (err) {
    console.error("❌ Upload Error Details:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;