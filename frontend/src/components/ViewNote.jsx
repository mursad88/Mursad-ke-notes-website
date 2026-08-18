import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // डेटाबेस से इस खास नोट की पूरी डिटेल लाना
    axios.get(`http://localhost:5000/api/admin/all-notes`)
      .then(response => {
        if (response.data.success) {
          const foundNote = response.data.notes.find(n => n._id === id);
          setNote(foundNote);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching note details:", error);
        setLoading(false);
      });
  }, [id]);

  // Razorpay पेमेंट शुरू करने का फंक्शन
  const handleCheckout = async () => {
    try {
      // 1. बैकएंड से आर्डर मंगाना
      const { data } = await axios.post("http://localhost:5000/api/payment/checkout", {
        amount: note.price,
      });

      if (!data.success) {
        alert("पेमेंट आर्डर बनाने में समस्या ई!");
        return;
      }

      const order = data.order;

      // 2. Razorpay विकल्प सेटअप करना
      const options = {
        key: "rzp_test_TPiTOSlKpdcijW", // आपकी Razorpay Key ID
        amount: order.amount,
        currency: "INR",
        name: "Mursad ke Notes",
        description: note.title,
        order_id: order.id,
        handler: async function (response) {
          // 3. पेमेंट सफल होने के बाद वेरिफिकेशन के लिए भेजना
          try {
            const verifyUrl = `http://localhost:5000/api/payment/paymentverification?title=${encodeURIComponent(note.title)}`;
            const verifyData = await axios.post(verifyUrl, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.data.success !== false) {
              alert("पेमेंट सफल रहा! आपको नोट्स का एक्सेस मिल गया है।");
              window.location.href = `/notes?reference=${response.razorpay_payment_id}`;
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("पेमेंट वेरिफिकेशन फेल हो गया!");
          }
        },
        prefill: {
          name: "Gopal Yadav Student",
          email: "student@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Checkout error:", error);
      alert("पेमेंट प्रोसेस शुरू करने में एरर आ गई!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">
        <p className="text-xl">Loading note details...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">
        <p className="text-xl mb-4">Note not found!</p>
        <Link to="/" className="bg-blue-600 px-4 py-2 rounded-xl text-white no-underline">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-slate-800/85 border border-slate-700 p-8 rounded-2xl shadow-2xl">
        
        <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mb-6 inline-block no-underline">
          &larr; Back to Home
        </Link>

        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-4">
          {note.category || "General"}
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
          {note.title}
        </h1>

        <p className="text-slate-300 text-base leading-relaxed mb-8">
          {note.description}
        </p>

        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 mb-8 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Price for Full PDF Access</p>
            <p className="text-3xl font-black text-white mt-1">₹{note.price}</p>
          </div>
          <div className="text-right">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
              ✓ Instant 24-Hr Access
            </span>
          </div>
        </div>

        {/* Real Razorpay Payment Button */}
        <button 
          onClick={handleCheckout}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg cursor-pointer"
        >
          Proceed to Pay ₹{note.price}
        </button>

      </div>
    </div>
  );
}