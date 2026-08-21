import { useState, useEffect } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Notes States
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', price: '', description: '', content: '', validityDays: '365' });
  const [pdfFile, setPdfFile] = useState(null);
  const [sampleFile, setSampleFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null); // 👈 Note Edit ID

  // Team States
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamData, setTeamData] = useState({ name: '', role: '', description: '' });
  const [teamPhotoBase64, setTeamPhotoBase64] = useState('');
  const [teamLoading, setTeamLoading] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null); // 👈 Team Edit ID

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

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team`);
      const data = await res.json();
      if (data.success) setTeamMembers(data.members);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchTeam();
    }
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
    submitData.append('validityDays', formData.validityDays);
    if (pdfFile) submitData.append('pdfFile', pdfFile);
    if (sampleFile) submitData.append('sampleFile', sampleFile);

    try {
      let url = `${API_URL}/api/admin/add-note`;
      let method = 'POST';

      if (editingNoteId) {
        url = `${API_URL}/api/admin/update-note/${editingNoteId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        setFormData({ title: '', category: '', price: '', description: '', content: '', validityDays: '365' });
        setPdfFile(null);
        setSampleFile(null);
        setEditingNoteId(null);
        if(document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
        if(document.getElementById('sampleInput')) document.getElementById('sampleInput').value = '';
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

  // ✏️ Edit Note Click Handler
  const handleEditNote = (item) => {
    setEditingNoteId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      price: item.price,
      description: item.description,
      content: item.content || '',
      validityDays: item.validityDays || '365'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Team Functions
  const handleTeamPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setTeamPhotoBase64(reader.result);
      };
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!editingTeamId && !teamPhotoBase64) {
      alert("कृपया मेंबर की फोटो चुनें!");
      return;
    }
    setTeamLoading(true);

    try {
      let url = `${API_URL}/api/team/add`;
      let method = 'POST';

      if (editingTeamId) {
        url = `${API_URL}/api/team/update/${editingTeamId}`;
        method = 'PUT';
      }

      const bodyData = { ...teamData };
      if (teamPhotoBase64) bodyData.photo = teamPhotoBase64;

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        setTeamData({ name: '', role: '', description: '' });
        setTeamPhotoBase64('');
        setEditingTeamId(null);
        if(document.getElementById('teamPhotoInput')) document.getElementById('teamPhotoInput').value = '';
        fetchTeam();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setTeamLoading(false);
    }
  };

  // ✏️ Edit Team Click Handler
  const handleEditTeam = (member) => {
    setEditingTeamId(member._id);
    setTeamData({
      name: member.name,
      role: member.role,
      description: member.description
    });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm("क्या आप सच में इस मेंबर को हटाना चाहते हैं?")) return;
    try {
      const res = await fetch(`${API_URL}/api/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("टीम मेंबर हटा दिया गया!");
        fetchTeam();
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
            <p className="text-blue-200 mt-1">Manage Notes, Validity & Team Members easily.</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition">
            Logout
          </button>
        </div>

        {/* Add / Update Note Form */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-bold">{editingNoteId ? "✏️ Update Note" : "Add New Note & PDFs"}</h2>
            {editingNoteId && (
              <button 
                onClick={() => { setEditingNoteId(null); setFormData({ title: '', category: '', price: '', description: '', content: '', validityDays: '365' }); }} 
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
              >
                Cancel Edit ❌
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Validity (दिन)</label>
                <select 
                  name="validityDays" 
                  value={formData.validityDays} 
                  onChange={handleChange} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 text-base shadow-sm"
                >
                  <option value="30">30 Days (1 महीना)</option>
                  <option value="90">90 Days (3 महीने)</option>
                  <option value="180">180 Days (6 महीने)</option>
                  <option value="365">365 Days (1 साल)</option>
                  <option value="730">730 Days (2 साल)</option>
                </select>
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

            <button type="submit" disabled={loading} className={`text-white font-bold px-8 py-3 rounded-lg transition w-full md:w-auto ${editingNoteId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {loading ? "Processing... ⏳" : (editingNoteId ? "💾 Update Note" : "➕ Publish Note")}
            </button>
          </form>
        </div>

        {/* Add / Update Team Member Section */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-bold">{editingTeamId ? "✏️ Update Team Member" : "Add Team Member 👨‍💻"}</h2>
            {editingTeamId && (
              <button 
                onClick={() => { setEditingTeamId(null); setTeamData({ name: '', role: '', description: '' }); }} 
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
              >
                Cancel Edit ❌
              </button>
            )}
          </div>
          <form onSubmit={handleTeamSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Member Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Gopal Yadav" 
                  value={teamData.name} 
                  onChange={(e) => setTeamData({...teamData, name: e.target.value})} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Role / Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Developer" 
                  value={teamData.role} 
                  onChange={(e) => setTeamData({...teamData, role: e.target.value})} 
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="bg-slate-950 p-4 border-2 border-dashed border-purple-500/50 rounded-lg">
                <label className="block text-sm font-bold text-purple-400 mb-2">Upload Photo</label>
                <input 
                  type="file" 
                  id="teamPhotoInput" 
                  accept="image/*" 
                  onChange={handleTeamPhotoChange} 
                  className="w-full text-sm text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Short Description</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. वेबसाइट संभालते हैं" 
                value={teamData.description} 
                onChange={(e) => setTeamData({...teamData, description: e.target.value})} 
                className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <button type="submit" disabled={teamLoading} className={`text-white font-bold px-8 py-3 rounded-lg transition w-full md:w-auto ${editingTeamId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {teamLoading ? "Processing... ⏳" : (editingTeamId ? "💾 Update Member" : "➕ Add Team Member")}
            </button>
          </form>

          {/* Team Members List */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-bold mb-4">Current Team Members ({teamMembers.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <div key={member._id} className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 justify-between">
                  <div className="flex items-center gap-3">
                    <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500" />
                    <div>
                      <h4 className="font-bold text-sm">{member.name}</h4>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTeam(member)} className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white p-2 rounded-lg transition text-sm font-bold" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteTeam(member._id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-lg transition text-sm font-bold" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-3">Published Notes ({notes.length})</h2>
          {notes.map((item) => (
            <div key={item._id} className="py-4 flex justify-between items-center border-b border-slate-800 gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.category} • <span className="text-emerald-400 font-bold">₹{item.price}</span> • वैलिडिटी: {item.validityDays || 365} दिन</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEditNote(item)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 text-sm transition">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;