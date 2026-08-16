import { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('अकाउंट बनाया जा रहा है...');
    
    try {
      // हमारे बैकएंड API को रिक्वेस्ट भेजना
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ अकाउंट सफलतापूर्वक बन गया! अब आप लॉगिन कर सकते हैं।');
        // फॉर्म को खाली कर देना
        setEmail('');
        setPassword('');
      } else {
        setMessage('❌ ' + data.message); // जैसे अगर ईमेल पहले से मौजूद हो
      }
    } catch (error) {
      setMessage('❌ सर्वर से जुड़ने में समस्या आ रही है।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-green-600">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Sign up to buy and access premium notes.</p>
        </div>
        
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Create Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* मैसेज यहाँ दिखाई देगा */}
        {message && (
          <div className="mt-4 text-center font-bold text-lg">
            {message}
          </div>
        )}

        <p className="text-center text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-green-600 font-bold cursor-pointer hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;