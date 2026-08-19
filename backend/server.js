// यह लाइन सबसे ऊपर होनी चाहिए ताकि .env फाइल की चाबियां पढ़ी जा सकें
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// मिडलवेयर (Middlewares)
app.use(cors());
app.use(express.json());
// यह लाइन डेटा को पढ़ने के लिए बहुत ज़रूरी है
app.use(express.urlencoded({ extended: true }));

// डेटाबेस (MongoDB) से जुड़ने का कोड
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB सफलता से जुड़ गया है!'))
  .catch((err) => console.log('❌ MongoDB से जुड़ने में एरर:', err));

// --- रास्तों (Routes) का सेटअप ---

// 1. ऑथेंटिकेशन (Login / Signup) के रास्ते
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 2. पेमेंट (Razorpay) के रास्ते
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// 3. एडमिन के रास्ते
const adminRoute = require('./routes/admin');
app.use('/api/admin', adminRoute);

// 4. नोट्स (Notes) के रास्ते
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);
// -------------------------------

// सर्वर चालू करने का कोड
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 बैकएंड सर्वर पोर्ट ${PORT} पर चल रहा है`);
});