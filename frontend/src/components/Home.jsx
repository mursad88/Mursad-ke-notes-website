import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://mursad-ke-notes-website.onrender.com";

function Home() {
  const [notes, setNotes] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'School', 'Graduate', 'Computer', 'Accounting'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesRes = await axios.get(`${API_URL}/api/notes`);
        if (notesRes.data.success) {
          setNotes(notesRes.data.notes);
        }

        const teamRes = await axios.get(`${API_URL}/api/team`);
        if (teamRes.data.success) {
          setTeamMembers(teamRes.data.members);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Navbar (अब यहाँ से Login बटन हटा दिया गया है, नेविगेशन बिल्कुल साफ़ है) */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                Mursad Notes
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Study Hub</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <Link 
              to="/signup" 
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 transition"
            >
              Get Started 🚀
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 text-center max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Trusted by Top Students
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          Master Your Studies with <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Category Wise Notes
          </span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
          Find clean, structured notes tailored specifically for School, Graduate, and Computer courses.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative shadow-2xl">
          <input 
            type="text"
            placeholder="Search notes by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base backdrop-blur-sm transition"
          />
          <span className="absolute right-5 top-4 text-slate-500 text-xl pointer-events-none">🔍</span>
        </div>
      </header>

      {/* Categories Filter Buttons */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center gap-2 ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105' 
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{cat === 'School' ? '🏫' : cat === 'Graduate' ? '🎓' : cat === 'Computer' ? '💻' : cat === 'Accounting' ? '📊' : '📂'}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid Section */}
      <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h3 className="text-2xl font-extrabold flex items-center gap-3">
            <span className="w-2.5 h-7 bg-blue-500 rounded-full inline-block"></span>
            {selectedCategory === 'All' ? 'All Available Notes' : `${selectedCategory} Notes`} 
            <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
              {filteredNotes.length}
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400 text-lg animate-pulse flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Waking up server & fetching notes... ⏳
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-24 text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
            <p className="text-xl mb-2">📂 No notes found in this category</p>
            <p className="text-sm text-slate-600">Try selecting another department or clearing search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNotes.map((note, idx) => (
              <div 
                key={note._id} 
                className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 hover:border-blue-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {note.category}
                    </span>
                    {idx === 0 && (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        🔥 Popular
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition line-clamp-1">{note.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">{note.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-800/60">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Price</span>
                    <span className="text-2xl font-black text-emerald-400">₹{note.price}</span>
                  </div>
                  <Link 
                    to={`/view-note/${note._id}`} 
                    className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 transition group-hover:scale-[1.02]"
                  >
                    View Details & Sample 👁️
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- Dynamic Team Section --- */}
      {teamMembers.length > 0 && (
        <div className="py-16 bg-slate-900/40 border-t border-slate-800/80 text-white relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">मिलिए हमारी टीम से 👨‍💻</h2>
              <p className="text-slate-400">यह हैं वे चेहरे जो आपके लिए बेहतरीन नोट्स तैयार करने में दिन-रात मेहनत करते हैं।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-slate-900 p-5 rounded-2xl text-center border border-slate-800 shadow-lg hover:border-blue-500 transition duration-300">
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-blue-600 shadow-md"
                  />
                  <h3 className="font-bold text-lg text-white">{member.name}</h3>
                  <p className="text-xs text-blue-400 font-semibold mt-1">{member.role}</p>
                  <p className="text-xs text-slate-400 mt-2">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer (यहाँ फुटर में एडमिन पैनल का सीक्रेट लिंक जोड़ दिया गया है) */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Mursad Notes Website. All Rights Reserved.</p>
          <Link 
            to="/admin" 
            className="text-xs text-slate-600 hover:text-blue-400 transition flex items-center gap-1 font-mono"
            title="Secure Admin Access"
          >
            🔒 Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;