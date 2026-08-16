const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ success: false, message: "Access denied!" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role === 'admin') next();
    else res.status(403).json({ success: false, message: "Not an admin!" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Session expired." });
  }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid ID or Password!" });
  }
});

router.post('/add-note', verifyAdmin, upload.fields([
  { name: 'pdfFile', maxCount: 1 },
  { name: 'sampleFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, category, price, description, content } = req.body;
    let pdfFilePath = "";
    let sampleFilePath = "";

    if (req.files && req.files['pdfFile']) {
      pdfFilePath = req.files['pdfFile'][0].path.replace(/\\/g, "/");
    }
    if (req.files && req.files['sampleFile']) {
      sampleFilePath = req.files['sampleFile'][0].path.replace(/\\/g, "/");
    }

    const newNote = new Note({ 
      title, 
      category, 
      price, 
      description, 
      content, 
      pdfFile: pdfFilePath,
      sampleFile: sampleFilePath 
    });
    
    await newNote.save();
    res.status(201).json({ success: true, message: "Note added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

router.get('/all-notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading notes." });
  }
});

router.delete('/delete-note/:id', verifyAdmin, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting note." });
  }
});

module.exports = router;