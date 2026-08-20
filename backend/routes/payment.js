const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Note = require('../models/Note');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. आर्डर क्रिएट करने का राउट
router.post('/create-order', async (req, res) => {
    try {
        const { noteId } = req.body;
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const options = {
            amount: Number(note.price) * 100,
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error in create-order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. पेमेंट वेरीफाई और डेटाबेस में expiryDate के साथ सेव करने का राउट
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, noteId } = req.body;

        // नोट की वैलिडिटी ढूंढें
        const note = await Note.findById(noteId);
        const validityDays = note ? note.validityDays : 30; // अगर नोट न मिले तो डिफ़ॉल्ट 30 दिन

        // एक्सपायरी डेट कैलकुलेट करें
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + validityDays);

        const newPayment = new Payment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            noteId, // यहाँ नोट की आईडी भी सेव करें ताकि डैशबोर्ड में पता चले
            title: note ? note.title : "प्रीमियम नोट्स",
            expiryDate: expiryDate // 👈 यह नई एक्सपायरी डेट सेव होगी
        });

        await newPayment.save();

        res.status(200).json({
            success: true,
            message: "Payment verified, Access granted until " + expiryDate.toDateString(),
        });
    } catch (error) {
        console.error("Error in verify-payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;