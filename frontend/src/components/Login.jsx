import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://mursad-ke-notes-website.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('studentToken', data.token);
        alert('🎉 Login Successful!');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid Email or Password');
      }
    } catch (err) {
      setError('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-blue-900">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Student Login</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Access your purchased notes and dashboard</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="student@gmail.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition shadow-md"
          >
            {loading ? "Logging in... ⏳" : "Login 🚀"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;