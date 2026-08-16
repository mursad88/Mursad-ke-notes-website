import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg sm:text-xl font-bold text-blue-600">
              Mursad ke <span className="text-yellow-500">Notes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/admin-login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
              Admin Login
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-lg bg-gray-50 border border-gray-200"
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
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-1 font-medium text-base"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-1 font-medium text-base"
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-1 font-medium text-base"
          >
            Login
          </Link>
          <div className="pt-2">
            <Link 
              to="/admin-login" 
              onClick={() => setIsOpen(false)}
              className="block text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition shadow-sm"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}