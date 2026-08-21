import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/admin'; 
import Dashboard from './components/Dashboard'; 
import Notes from './components/Notes';
import Login from './components/Login';
import Signup from './components/Signup';
import ViewNote from './components/ViewNote';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        
        {/* 🚀 Ultra-Professional Navbar */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm text-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-center sm:h-20 gap-3">
            
            {/* Brand Logo */}
            <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
              <span className="bg-blue-900 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition">📚</span>
              <div>
                <span className="text-blue-900">Mursad ke</span>{" "}
                <span className="text-amber-500">Notes</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-bold text-gray-600 text-sm sm:text-base">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
              
              {/* Stylish New Login Button */}
              <Link 
                to="/login" 
                className="relative group px-6 py-2.5 rounded-2xl font-extrabold text-sm text-blue-600 bg-blue-50 border border-blue-200/80 shadow-sm hover:shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <span className="text-base group-hover:rotate-12 transition-transform duration-300">🔐</span>
                <span>User Login</span>
              </Link>
            </div>

          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/view-note/:id" element={<ViewNote />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm border-t border-gray-800">
          © {new Date().getFullYear()} Mursad ke Notes - Curated by Gopal Yadav 🚀
        </footer>
      </div>
    </Router>
  );
}

export default App;