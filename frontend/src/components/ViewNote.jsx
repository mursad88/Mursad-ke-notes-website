import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/notes/${id}`);
        // यहाँ चेक कर रहे हैं कि डेटा कैसे आ रहा है (डेटा या डेटा.note)
        if (data.success) {
          setNote(data.note || data.notes || data);
        } else if (data.title) {
          setNote(data);
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

      const { data } = await axios.post(`${API_URL}/api/payment/create-order`, { noteId: id }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (data.success) {
        const options = {
          key: "rzp_test_TPiTOSlKpdcijW",
          amount: data.order.amount,
          currency: "INR",
          name: "Mursad Notes",
          description: note?.title || "Notes",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(`${API_URL}/api/payment/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                title: note?.title
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

  if (loading) return <div className="text-center py-24 text-white text-lg font-bold">Loading note details... ⏳</div>;

  if (!note) return <div className="text-center py-24 text-red-400 text-lg font-bold">Note not found! ❌</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto text-white space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
        <span className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          {note.category || "General"}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white">{note.title || "Untitled Note"}</h1>
        <p className="text-slate-300 text-base leading-relaxed">{note.description || "No description available."}</p>
        <div className="text-2xl font-black text-emerald-400 pt-2">
          Price: ₹{note.price || 0}
        </div>
        
        <div className="pt-4">
          <button 
            onClick={handleBuy} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition text-base w-full md:w-auto"
          >
            Buy Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewNote;