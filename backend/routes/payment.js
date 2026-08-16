const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Note = require('../models/Note'); // यहाँ हमने Note मॉडल को इम्पोर्ट कर लिया है
const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. पेमेंट का ऑर्डर बनाने का रास्ता
router.post('/checkout', async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100, 
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "सर्वर एरर!" });
  }
});

// 2. पेमेंट वेरिफिकेशन और डेटाबेस में सेव करना
router.post('/paymentverification', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const { title } = req.query; // URL से नोट्स का नाम निकाला गया है

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // पेमेंट असली है, अब रसीद और 'नाम' दोनों को डेटाबेस में सेव करें
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      title: title || "प्रीमियम नोट्स", 
    });

    res.redirect(`http://localhost:5173/notes?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({ success: false, message: "पेमेंट असफल रहा!" });
  }
});

// 3. डैशबोर्ड के लिए खरीदी गई नोट्स मंगाने का रास्ता
router.get('/mypurchases', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "सर्वर एरर!" });
  }
});

// 4. असली नोट्स का कंटेंट भेजने का रास्ता (डेटाबेस से जुड़ा हुआ)
router.get('/get-note-content/:reference', async (req, res) => {
  try {
    // 1. रसीद नंबर से पेमेंट ढूँढना
    const payment = await Payment.findOne({ razorpay_payment_id: req.params.reference });
    
    if (!payment) {
      return res.status(404).json({ success: false, message: "रसीद नहीं मिली! कृपया सही लिंक का उपयोग करें।" });
    }

    // 2. 24 घंटे का समय चेक करना
    const purchaseDate = new Date(payment.date);
    const now = new Date();
    const hoursPassed = Math.abs(now - purchaseDate) / 36e5; 

    if (hoursPassed > 24) {
      return res.status(403).json({ success: false, message: "आपके नोट्स देखने का 24 घंटे का समय समाप्त हो चुका है।" });
    }

    // 3. डेटाबेस (Note मॉडल) से विषय के असली नोट्स ढूँढना
    const actualNote = await Note.findOne({ title: payment.title });
    
    let noteContent = "<p>इस विषय के नोट्स अभी सर्वर पर अपडेट नहीं किए गए हैं।</p>";
    
    // अगर एडमिन पैनल से नोट डाला गया है, तो उसका कंटेंट सेट करें
    if (actualNote && actualNote.content) {
      noteContent = actualNote.content;
    }

    // 4. सुरक्षित डेटा वापस भेजना
    res.status(200).json({
      success: true,
      title: payment.title,
      content: noteContent,
      purchaseDate: payment.date
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "सर्वर एरर!" });
  }
});

module.exports = router;