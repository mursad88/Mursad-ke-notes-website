import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function ViewNote() {
  const { id } = useParams(); // URL से नोट की असली आईडी उठाएगा
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/notes/${id}`);
        if (data.success) {
          setNote(data.note);
        }
      } catch (err) {
        console.error("Error fetching note details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNoteDetail();
  }, [id]);

  const handleBuy = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first to buy notes!");
        return;
      }

      // 1. Backend se order create karein
      const { data } = await axios.post(`${API_URL}/api/payment/create-order`, { noteId: id }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (data.success) {
        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", // अपनी Razorpay Key यहाँ डालें
          amount: data.order.amount,
          currency: "INR",
          name: "Mursad Notes",
          description: note.title,
          order_id: data.order.id,
          handler: async function (response) {
            // 2. Payment verify hone par database me save karein
            try {
              const verifyRes = await axios.post(`${API_URL}/api/payment/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                title: note.title
              });
              if (verifyRes.data.success) {
                alert("Payment Successful! Notes added to your library.");
              }
            } catch (error) {
              console.error("Verification failed", error);
            }
          },
          theme: {
            color: "#2563eb",
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Payment initiation failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-24 text-white">Loading note details...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <p className="text-slate-400 mb-6">{note.description}</p>
      <p className="text-xl font-black text-emerald-400 mb-6">Price: ₹{note.price}</p>
      
      <button onClick={handleBuy} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition">
        Buy Now 🚀
      </button>
    </div>
  );
}

export default ViewNote;