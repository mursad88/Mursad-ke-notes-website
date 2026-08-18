import { useState, useEffect } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching user notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Student Dashboard 🎓</h1>
            <p className="text-blue-200 mt-1">Manage your purchased notes and secure downloads.</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Logout 🚪
          </button>
        </div>

        {/* Purchased Notes Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">My Library ({userNotes.length})</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading your library...</div>
          ) : userNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">You haven't purchased any notes yet.</p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Browse Notes 📚
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotes.map((note) => (
                <div key={note._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{note.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Category: <span className="font-semibold text-blue-600">{note.category}</span></p>
                  </div>
                  <a 
                    href={`${API_URL}/api/notes/download/${note._id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition text-center shadow"
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