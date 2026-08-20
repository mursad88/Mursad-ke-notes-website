import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 border-t-8 border-green-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">Create Account 🎯</h2>
          <p className="text-gray-500 text-sm mt-1">Join to buy and download premium notes</p>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold">{error}</div>}
        {message && <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm font-bold">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Gopal Yadav"
              className="w-full p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-400 text-base shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@example.com"
              className="w-full p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-400 text-base shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              className="w-full p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-400 text-base shadow-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200"
          >
            {loading ? "Creating... ⏳" : "Register Now 🚀"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;