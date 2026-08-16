import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');

  // लॉगआउट करने का फंक्शन
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // लॉगआउट करते ही पेज रिफ्रेश होकर होम पर आ जाएगा
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* वेबसाइट का लोगो / नाम */}
        <Link to="/" className="text-2xl font-extrabold text-blue-900 tracking-tight">
          MyNotes <span className="text-yellow-500">Hub</span>
        </Link>
        
        {/* मेनू के बटन */}
        <div className="flex space-x-4 md:space-x-6 items-center">
          
          <Link to="/" className="text-gray-700 font-bold hover:text-blue-600 transition">होम</Link>
          
          {/* 👇 यह रहा आपका नया एडमिन पैनल का बटन 👇 */}
          <Link to="/admin" className="text-purple-700 font-extrabold hover:text-purple-900 bg-purple-100 px-3 py-1 rounded-md transition">
            👑 एडमिन
          </Link>

          {/* लॉगिन / लॉगआउट के बटन */}
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-bold hover:text-blue-600 transition">डैशबोर्ड</Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition"
              >
                लॉगआउट
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-bold hover:text-blue-600 transition">लॉगिन</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition">
                साइन अप
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;