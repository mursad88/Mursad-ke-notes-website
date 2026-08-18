import { useState, useEffect } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);

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
      }
    };
    fetchUserNotes();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Purchased Notes</h1>
      {userNotes.length === 0 ? (
        <p className="text-gray-500">You haven't purchased any notes yet.</p>
      ) : (
        <div className="space-y-4">
          {userNotes.map((note) => (
            <div key={note._id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className="text-sm text-gray-500">{note.category}</p>
              </div>
              <a 
                href={`${API_URL}/api/notes/download/${note._id}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                📥 Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;