import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // यहाँ आपका नोट्स फैच करने का API कॉल आ जाएगा
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Master Your Studies with <span className="text-yellow-400">Mursad ke Notes</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8">
            Premium curated notes by Gopal Yadav. Learn smarter, not harder.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search notes (e.g., Tally, Programming)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 pl-5 pr-4 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
            />
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-8">
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20">
              ⚡ Instant Access
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20">
              🔒 100% Secure
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20">
              ✨ Verified Quality
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Available Notes
        </h2>

        {notes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-base sm:text-lg">No notes uploaded yet. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* जब नोट्स होंगे तब कार्ड्स यहाँ रेंडर होंगे */}
          </div>
        )}
      </div>
    </div>
  );
}