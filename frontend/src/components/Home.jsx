import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notes`);
        if (res.data.success) {
          setNotes(res.data.notes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchAllNotes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-900">Explore Available Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
            <p className="text-sm text-gray-500 my-2">{note.description}</p>
            <p className="text-green-600 font-extrabold text-lg mb-4">₹{note.price}</p>
            <a 
              href={`/view-note/${note._id}`} 
              className="block text-center bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              View Details & Sample
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;