import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/payment/mypurchases');
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-3xl font-extrabold">Student Dashboard</h1>
          <p className="text-blue-200 mt-1">Welcome back! Here are all the premium notes you have purchased.</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-xl font-bold text-blue-900 animate-pulse mt-10">Loading your purchases... ⏳</div>
        ) : payments.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-md text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Purchases Yet</h2>
            <p className="text-gray-500 mb-6">You haven't bought any premium notes. Explore our collection and boost your studies!</p>
            <Link to="/" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md inline-block">
              Browse Notes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{payment.title || "Premium Notes"}</h3>
                  <p className="text-sm text-gray-500 font-mono mb-1">Receipt: {payment.razorpay_payment_id}</p>
                  <p className="text-sm text-green-600 font-semibold">
                    Purchased on: {new Date(payment.date).toLocaleString('en-IN')}
                  </p>
                </div>
                <Link 
                  to={`/notes?reference=${payment.razorpay_payment_id}`} 
                  className="bg-yellow-500 text-blue-900 font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition w-full md:w-auto text-center"
                >
                  View Notes 📖
                </Link>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;