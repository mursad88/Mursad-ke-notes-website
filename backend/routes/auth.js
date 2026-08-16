const express = require('express');
const router = express.Router();
const User = require('../models/User'); // जो मॉडल हमने स्टेप 1 में बनाया है

// रजिस्टर (Sign Up) API
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // चेक करना कि ईमेल डेटाबेस में पहले से तो नहीं है
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "यह ईमेल पहले से रजिस्टर है!" });
    }

    // नया यूज़र बनाना और डेटाबेस में सेव करना
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "अकाउंट सफलतापूर्वक बन गया!" });
  } catch (error) {
    res.status(500).json({ message: "सर्वर में कोई समस्या है।" });
  }
});

// लॉगिन (Login) API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // यूज़र को डेटाबेस में ढूँढना
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "गलत ईमेल या पासवर्ड!" });
    }

    // पासवर्ड चेक करना
    if (user.password !== password) {
      return res.status(400).json({ message: "गलत ईमेल या पासवर्ड!" });
    }

    res.status(200).json({ message: "लॉगिन सफल हुआ!" });
  } catch (error) {
    res.status(500).json({ message: "सर्वर में कोई समस्या है।" });
  }
});

module.exports = router;