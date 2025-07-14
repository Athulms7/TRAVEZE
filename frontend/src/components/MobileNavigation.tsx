import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu}
        className="p-2 text-gray-600"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-600"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col items-center gap-6 p-8">
            <Link 
              to="/"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/holiday-packages"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              Holiday Packages
            </Link>
            <Link 
              to="/self-planning"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              Self Planning
            </Link>
            <Link 
              to="/itineraries"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              Itineraries
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation; 