import { useState } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Signup successful! You can now login.");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("Server connection failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Student Signup</h2>
        {message && <p className="mb-4 text-center font-bold text-sm">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            required 
            value={formData.username} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;