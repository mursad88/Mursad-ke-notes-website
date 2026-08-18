import { useState, useEffect } from 'react';
import axios from 'axios';

// यह आपकी लाइव बैकएंड लिंक है
const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotes = async () => {
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
    fetchAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* आपका पुराना हेडर और डिज़ाइन वाला हिस्सा */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
            Welcome to Notes Website 📚
          </h1>
          <p className="text-gray-600">
            Explore and purchase high-quality academic and professional notes.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-lg font-semibold text-gray-500">
            Loading notes... ⏳
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div 
                key={note._id} 
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                    {note.category}
                  </span>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-green-600">₹{note.price}</span>
                  </div>
                  <a 
                    href={`/view-note/${note._id}`} 
                    className="block text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    View Details & Sample 🚀
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;