import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // हम अलग से CSS फाइल जोड़ रहे हैं

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">Mursad ke <span>Notes</span></Link>
        </div>

        {/* Desktop Links (सिर्फ कंप्यूटर पर दिखेगा) */}
        <div className="desktop-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/admin-login" className="admin-btn">Admin Login</Link>
        </div>

        {/* Mobile Hamburger Button (सिर्फ मोबाइल पर दिखेगा) */}
        <div className="mobile-toggle">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mobile-dropdown">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/admin-login" onClick={() => setIsOpen(false)} className="admin-btn-mob">Admin Login</Link>
        </div>
      )}
    </nav>
  );
}