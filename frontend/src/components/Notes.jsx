import { useState, useEffect } from 'react';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notes`);
        const data = await response.json();
        if (data.success) {
          setNotes(data.notes);
        }
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    };
    getNotes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">All Notes List</h2>
      <div className="space-y-4">
        {notes.map((noteData) => (
          <div key={noteData._id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl">{noteData.title}</h3>
              <p className="text-gray-600">{noteData.category}</p>
            </div>
            {/* यहाँ पीडीएफ का प्रीव्यू या इमेज लिंक */}
            {noteData.sampleFile && (
              <iframe 
                src={`${API_URL}/${noteData.sampleFile}`} 
                title="PDF Sample" 
                className="w-32 h-20 border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;