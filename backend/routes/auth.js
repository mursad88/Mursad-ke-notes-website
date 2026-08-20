const express = require('express');
const router = express.Router();
const User = require('../models/User'); // यूजर मॉडल

// रजिस्टर (Sign Up) API - यहाँ /register को बदलकर /signup कर दिया गया है
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // चेक करना कि ईमेल डेटाबेस में पहले से तो नहीं है
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "यह ईमेल पहले से रजिस्टर है!" });
    }

    // नया यूज़र बनाना और डेटाबेस में सेव करना (username के साथ)
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: "अकाउंट सफलतापूर्वक बन गया!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "सर्वर में कोई समस्या है।" });
  }
});

// लॉगिन (Login) API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // यूज़र को डेटाबेस में ढूँढना
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "गलत ईमेल या पासवर्ड!" });
    }

    // पासवर्ड चेक करना
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "गलत ईमेल या पासवर्ड!" });
    }

    res.status(200).json({ success: true, message: "लॉगिन सफल हुआ!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "सर्वर में कोई समस्या है।" });
  }
});

module.exports = router;