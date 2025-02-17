import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../../assets/Rangi-Lalls-logo.png"
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }
  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    navigate('/login');
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
          <div className="flex items-center cursor-pointer">
            <img src={logo} alt="Auction Focus" className="h-8 w-auto sm:h-10" />
          </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 font-medium transition-colors duration-200">
                Upcoming Auction
              </Link>
              <Link to="/assets" className="text-gray-700 hover:text-primary px-3 py-2 font-medium transition-colors duration-200">
                Assets Listing
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary px-3 py-2 font-medium transition-colors duration-200">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary px-3 py-2 font-medium transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
          {user ? (
          <>
            <span className="text-gray-700">Welcome, {user.firstName}</span>
            <button 
              onClick={handleLogout}
              className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-900"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={()=>navigate("/Register")} className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary-dark">
              Registration
            </button>
            <button onClick={()=>navigate("/login")} className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-900">
              Login
            </button>
          </>
        )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link 
            to="/" 
            className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200"
          >
            Upcoming Auction
          </Link>
          <Link 
            to="/assets" 
            className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200"
          >
            Assets Listing
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200"
          >
            Contact Us
          </Link>
          <div className="flex flex-col space-y-2 px-3 py-2">
            <Link 
              to="/register" 
              className="w-full bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-primary-dark transition-colors duration-200 text-center"
            >
              Registration
            </Link>
            <Link 
              to="/login" 
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-900 transition-colors duration-200 text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;