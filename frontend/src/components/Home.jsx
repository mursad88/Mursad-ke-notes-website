import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // बैकएंड डेटाबेस से असली नोट्स मँगाने का कोड
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/all-notes')
      .then(response => {
        if (response.data.success) {
          setNotes(response.data.notes);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Notes laane me error aayi:", error);
        setLoading(false);
      });
  }, []);

  // कैटेगरी और सर्च के हिसाब से नोट्स फ़िल्टर करना
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Ultra Professional Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            India's Trusted Digital Notes Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
            Supercharge Your Learning with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Mursad ke Notes</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Verified premium study guides for School, College degrees, Computer programming, and Competitive exams curated by Gopal Yadav.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex items-center border border-slate-700">
            <input
              type="text"
              placeholder="Search subjects, Tally, Physics, BCA, Exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base rounded-xl"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg whitespace-nowrap">
              Search Notes
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14 pt-8 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">10k+</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Happy Learners</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-yellow-400">50+</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Expert Guides</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Secure PDFs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Explore Professional Notes</h2>
            <p className="text-slate-400 text-sm mt-1">Filter by your specific educational stream.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/60">
            {["All", "School", "College", "Computer", "Competitive"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Loading professional notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg">No notes found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note._id} 
                className="bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 rounded-2xl border border-slate-700/70 p-6 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                      {note.category || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                      ★ 4.9 <span className="text-slate-400 font-normal">(Verified)</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition leading-snug">
                    {note.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light line-clamp-2">
                    {note.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Instant Access</span>
                    <span className="text-xl font-black text-white">₹{note.price}</span>
                  </div>
                  <Link 
                    to={`/view-note/${note._id}`} 
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition duration-200 shadow-md text-sm no-underline"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Professional Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-base font-bold text-white mb-2">Mursad ke Notes</p>
          <p className="text-sm text-slate-500">
            © 2026 Developed & Curated with dedication by Gopal Yadav. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}