import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false); // 👈 Check karne ke liye ki user ne kharida hai ya nahi

  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/notes/${id}`);
        if (data.success) {
          setNote(data.note || data.notes || data);
        } else if (data.title) {
          setNote(data);
        }

        // Check if user has already purchased this note (Optional/If API supports)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const checkRes = await axios.get(`${API_URL}/api/user/check-purchase/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (checkRes.data.purchased) {
              setIsPurchased(true);
            }
          } catch (e) {
            // Ignore if endpoint doesn't exist yet
          }
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
        alert("कृपया पहले लॉगिन करें!");
        navigate('/login');
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
                alert("Payment Successful! Notes added to your library. 🎉");
                setIsPurchased(true);
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
      if (err.response && err.response.status === 401) {
        alert("सत्र समाप्त हो गया है, कृपया दोबारा लॉगिन करें।");
        navigate('/login');
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    }
  };

  if (loading) return <div className="text-center py-24 text-white text-lg font-bold">Loading note details... ⏳</div>;

  if (!note) return <div className="text-center py-24 text-red-400 text-lg font-bold">Note not found! ❌</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto text-white space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <span className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          {note.category || "General"}
        </span>
        
        <h1 className="text-3xl md:text-4xl font-black text-white">{note.title || "Untitled Note"}</h1>
        <p className="text-slate-300 text-base leading-relaxed">{note.description || "No description available."}</p>
        
        <div className="text-2xl font-black text-emerald-400">
          Price: ₹{note.price || 0}
        </div>
        
        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          
          {/* 1. View Sample PDF (फ्री डेमो - सभी विजिटर्स देख सकते हैं) */}
          {note.samplePdfUrl && (
            <a 
              href={note.samplePdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3.5 rounded-2xl font-bold transition text-center shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              👁️ View Sample PDF (Free Demo)
            </a>
          )}

          {/* 2. Buy Now or View Main PDF */}
          {isPurchased || note.isPurchased ? (
            note.pdfUrl && (
              <a 
                href={note.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition text-center shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                📥 Download Full Notes (Paid)
              </a>
            )
          ) : (
            <button 
              onClick={handleBuy} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition text-center flex items-center justify-center gap-2"
            >
              Buy Now 🚀 (₹{note.price || 0})
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default ViewNote;