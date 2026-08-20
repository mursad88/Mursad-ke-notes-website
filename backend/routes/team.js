const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// 1. सभी टीम मेंबर्स को देखने के लिए GET राउट (होमपेज के लिए)
router.get('/', async (req, res) => {
  try {
    const members = await Team.find();
    res.status(200).json({ success: true, members });
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. नया टीम मेंबर जोड़ने के लिए POST राउट (एडमिन के लिए)
router.post('/add', async (req, res) => {
  try {
    const { name, role, description, photo } = req.body;

    const newMember = new Team({
      name,
      role,
      description,
      photo
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: "टीम मेंबर सफलतापूर्वक जोड़ दिया गया है! 🚀"
    });
  } catch (err) {
    console.error("Error adding team member:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. किसी टीम मेंबर को डिलीट करने के लिए राउट
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "टीम मेंबर हटा दिया गया है!"
    });
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;