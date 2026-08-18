import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notes`);
        if (res.data.success) {
          setNotes(res.data.notes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-blue-900 text-white py-16 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Professional Academic & Tech Notes 📚
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-8">
            Access high-quality notes, structured learning materials, and secure previews instantly.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/signup" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-md transition">
              Get Started 🚀
            </a>
            <a href="/login" className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl shadow-md transition">
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Notes Grid Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 border-b pb-3">Available Notes</h2>

        {loading ? (
          <div className="text-center py-20 text-xl font-semibold text-gray-500 animate-pulse">
            Loading amazing notes... ⏳
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No notes published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div 
                key={note._id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {note.category}
                    </span>
                    <span className="text-2xl font-black text-green-600">₹{note.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{note.description}</p>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <a 
                    href={`/view-note/${note._id}`} 
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
                  >
                    View Sample & Details 👁️
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;