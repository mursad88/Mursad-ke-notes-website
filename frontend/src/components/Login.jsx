import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error or waking up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <h2 className="text-3xl font-black text-white text-center mb-2">Welcome Back</h2>
        <p className="text-slate-400 text-sm text-center mb-8">Enter your credentials to access your library</p>

        {error && <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-2xl text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="you@example.com"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              placeholder="••••••••"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition duration-200"
          >
            {loading ? "Authenticating... ⏳" : "Secure Login 🚀"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account? <Link to="/signup" className="text-blue-400 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;