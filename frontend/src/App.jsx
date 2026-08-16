import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/admin'; 
import Dashboard from './components/Dashboard'; 
import Notes from './components/Notes';
import Login from './components/Login';

function App() {
  const isAdminLoggedIn = localStorage.getItem('adminToken');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-md border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-extrabold text-blue-900">
              Mursad ke <span className="text-yellow-500">Notes</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="font-semibold text-gray-700 hover:text-blue-600 transition">Home</Link>
              <Link to="/dashboard" className="font-semibold text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
              <Link to="/login" className="font-bold text-blue-600 hover:underline">Login</Link>
              <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                {isAdminLoggedIn ? "👑 Admin" : "👑 Admin Login"}
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-6 text-center text-sm">
          © {new Date().getFullYear()} Mursad ke Notes - Curated by Gopal Yadav
        </footer>
      </div>
    </Router>
  );
}

export default App;