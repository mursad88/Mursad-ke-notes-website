import { useState } from 'react';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function ViewNote() {
  const [paymentData, setPaymentData] = useState({});

  const handleBuy = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/api/payment/create-order`, { noteId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Razorpay integration flow
      console.log(data);
    } catch (err) {
      console.error("Payment initiation failed", err);
    }
  };

  const verifyPayment = async (paymentDetails) => {
    const verifyUrl = `${API_URL}/api/payment/verify-payment`;
    try {
      const res = await axios.post(verifyUrl, paymentDetails);
      if (res.data.success) {
        alert("Payment verified successfully!");
      }
    } catch (err) {
      console.error("Verification error", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Note Detail Page</h1>
      <button onClick={() => handleBuy('sample_id')} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
        Buy Now 🚀
      </button>
    </div>
  );
}

export default ViewNote;