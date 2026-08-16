import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Mursad ke <span className="text-yellow-500">Notes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/admin-login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Login
          </Link>
          <Link 
            to="/admin-login" 
            onClick={() => setIsOpen(false)}
            className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition mt-2"
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}