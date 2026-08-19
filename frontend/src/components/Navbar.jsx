import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        
        {/* Logo / Brand Name */}
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
          <span className="bg-blue-900 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition">📚</span>
          <div>
            <span className="text-blue-900">Mursad ke</span>{" "}
            <span className="text-amber-500">Notes</span>
          </div>
        </Link>

        {/* Navigation Links, Contact & Admin Button */}
        <div className="flex items-center gap-5 md:gap-7 font-bold text-gray-600 text-sm md:text-base">
          <Link to="/" className="hover:text-blue-600 transition duration-200">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition duration-200">
            Dashboard
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition duration-200">
            Contact
          </Link>
          <Link to="/login" className="hover:text-blue-600 transition duration-200">
            Login
          </Link>
          <Link 
            to="/admin" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2 text-sm font-extrabold hover:scale-105"
          >
            <span>👑</span> Admin
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;