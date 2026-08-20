import { useState, useEffect } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', price: '', description: '', content: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [sampleFile, setSampleFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError("Server connection failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes`);
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    submitData.append('content', formData.content);
    if (pdfFile) submitData.append('pdfFile', pdfFile);
    if (sampleFile) submitData.append('sampleFile', sampleFile);

    try {
      const res = await fetch(`${API_URL}/api/admin/add-note`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        setFormData({ title: '', category: '', price: '', description: '', content: '' });
        setPdfFile(null);
        setSampleFile(null);
        document.getElementById('fileInput').value = '';
        document.getElementById('sampleInput').value = '';
        fetchNotes();
      } else {
        alert("❌ " + data.message);
        if (res.status === 401 || res.status === 403) handleLogout();
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/delete-note/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Note deleted!");
        fetchNotes();
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-blue-600">
          <h2 className="text-3xl font-extrabold text-center mb-2">Admin Login</h2>
          {loginError && <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm font-bold mb-4 text-center">{loginError}</div>}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Username</label>
              <input 
                type="text" 
                name="username" 
                required 
                value={loginData.username} 
                onChange={handleLoginChange} 
                className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                value={loginData.password} 
                onChange={handleLoginChange} 
                className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm"
              />
            </div>
            <button type="submit" disabled={isLoggingIn} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              {isLoggingIn ? "Logging in..." : "Login 🚀"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-blue-900 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold">👑 Secure Admin Panel</h1>
            <p className="text-blue-200 mt-1">Upload main notes and free sample PDFs easily.</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition">
            Logout
          </button>
        </div>

        {/* Add Note Form */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-3">Add New Note & PDFs</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Tally Prime Notes" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                <input 
                  type="text" 
                  name="category" 
                  required 
                  placeholder="e.g. Accounting" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  required 
                  placeholder="99" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
              <textarea 
                name="description" 
                required 
                rows="3" 
                placeholder="Short description..." 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500 text-base shadow-sm resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 border-2 border-dashed border-blue-500/50 rounded-lg">
                <label className="block text-sm font-bold text-blue-400 mb-2">Main PDF File (Paid)</label>
                <input type="file" id="fileInput" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="w-full text-sm text-slate-300"/>
              </div>
              <div className="bg-slate-950 p-4 border-2 border-dashed border-yellow-500/50 rounded-lg">
                <label className="block text-sm font-bold text-yellow-400 mb-2">Sample PDF File (Free Preview)</label>
                <input type="file" id="sampleInput" accept=".pdf" onChange={(e) => setSampleFile(e.target.files[0])} className="w-full text-sm text-slate-300"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto">
              {loading ? "Publishing... ⏳" : "➕ Publish Note"}
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-3">Published Notes ({notes.length})</h2>
          {notes.map((item) => (
            <div key={item._id} className="py-4 flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.category} • <span className="text-emerald-400 font-bold">₹{item.price}</span></p>
              </div>
              <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 text-sm">
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;