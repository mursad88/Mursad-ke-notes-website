import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/user/notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setUserNotes(data.notes);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black">Student Dashboard 🎓</h1>
            <p className="text-slate-400 mt-1">Access your purchased notes securely.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-sm transition">
              Home
            </Link>
            <button onClick={handleLogout} className="px-5 py-3 rounded-2xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold text-sm transition">
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Library Section */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-4">My Library ({userNotes.length})</h2>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading library...</div>
          ) : userNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">You haven't purchased any notes yet.</p>
              <Link to="/" className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition shadow-lg">
                Explore Notes 📚
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotes.map((note) => (
                <div key={note._id} className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-xl">{note.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">Category: <span className="text-blue-400">{note.category}</span></p>
                  </div>
                  <a 
                    href={`${API_URL}/api/notes/download/${note._id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition text-center shadow-lg"
                  >
                    📥 Download PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;