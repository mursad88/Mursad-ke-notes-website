const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');

// Razorpay का इंस्टेंस (यह आपकी .env फाइल से Keys उठाएगा)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. आर्डर क्रिएट करने का राउट (Buy Now के लिए)
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: Number(amount) * 100, // अमाउंट को पैसे (Paise) में बदलने के लिए 100 से गुणा
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ success: false, message: "Order creation failed" });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error in create-order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. पेमेंट वेरीफाई और डेटाबेस में सेव करने का राउट
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, title } = req.body;

        // यहाँ पेमेंट डेटाबेस में सेव हो रहा है
        const newPayment = new Payment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            title: title || "प्रीमियम नोट्स"
        });

        await newPayment.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and saved successfully",
        });
    } catch (error) {
        console.error("Error in verify-payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;