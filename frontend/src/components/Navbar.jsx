import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
          
          {/* Logo */}
          <div>
            <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
              Mursad ke <span style={{ color: '#eab308' }}>Notes</span>
            </Link>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link to="/dashboard" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
            <Link to="/login" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
            <Link to="/admin-login" style={{ backgroundColor: '#2563eb', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500, color: '#fff' }}>
              Admin Login
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e7eb', padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>Home</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>Dashboard</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>Login</Link>
          <Link to="/admin-login" onClick={() => setIsOpen(false)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}