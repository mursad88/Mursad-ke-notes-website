import { useState, useEffect } from 'react';

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/all-notes')
      .then(res => res.json())
      .then(data => { 
        if(data.success) setNotes(data.notes); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const checkoutHandler = async (amount, title) => {
    try {
      const res = await fetch('http://localhost:5000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      }).then(t => t.json());

      if (!res.success) {
        alert("Payment initialization failed");
        return;
      }

      const options = {
        key: "rzp_test_TPiTOSlKpdcijW",
        amount: res.order.amount,
        currency: "INR",
        name: "Mursad ke Notes",
        description: title,
        order_id: res.order.id,
        callback_url: `http://localhost:5000/api/payment/paymentverification?title=${encodeURIComponent(title)}`,
        theme: { color: "#4f46e5" }
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong with payment!");
    }
  };

  const categories = [...new Set(notes.map(n => n.category))];
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white py-24 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Master Your Studies with <span className="text-yellow-400">Mursad ke Notes</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">Premium curated notes by Gopal Yadav. Learn smarter, not harder.</p>
          
          <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex items-center">
            <input 
              type="text" 
              placeholder="🔍 Search notes (e.g., Tally, Programming)..." 
              className="w-full p-4 text-gray-800 outline-none px-6 text-lg rounded-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-12 flex flex-wrap justify-center gap-8 px-4 text-center">
        {['⚡ Instant Access', '🔒 100% Secure', '💯 Verified Quality'].map((item, i) => (
          <div key={i} className="bg-white px-8 py-4 rounded-full shadow-md font-bold text-indigo-900 border border-indigo-100">
            {item}
          </div>
        ))}
      </div>

      {/* Notes Sections */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-indigo-900 font-bold text-lg">Loading Premium Content... ⏳</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold text-lg">No notes uploaded yet. Please check back soon!</p>
        ) : (
          categories.map((cat, i) => (
            <div key={i} className="mb-16">
              <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center">
                <span className="bg-indigo-600 w-2 h-8 rounded-full mr-3"></span> {cat}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {filteredNotes.filter(n => n.category === cat).map(n => (
                  <div key={n._id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-indigo-600">{n.title}</h3>
                      <p className="text-gray-500 mb-6 text-sm">{n.description}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-3xl font-black text-indigo-900">₹{n.price}</span>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">{n.category}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        {n.sampleFile && (
                          <a href={`http://localhost:5000/${n.sampleFile}`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition text-sm">Preview</a>
                        )}
                        <button onClick={() => checkoutHandler(n.price, n.title)} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-sm">Buy Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;