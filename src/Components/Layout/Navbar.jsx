import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/Rangi-Lalls-logo.png";
import { useSelector, useDispatch } from 'react-redux';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle clicking outside of dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center space-x-2 cursor-pointer" 
                  onClick={toggleDropdown}
                >
                  <FaUserCircle className="text-gray-700 text-xl" />
                  <span className="text-gray-700">Welcome, {user.firstName}</span>
                </div>
                
                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link 
                      to="/dashboard/interested-properties" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Interested Properties
                    </Link>
                    <Link 
                      to="/dashboard/bidding-history" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Bidding History
                    </Link>
                  {user?.role==="admin"&&
                  <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>}  
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate("/Register")} className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary-dark">
                  Registration
                </button>
                <button onClick={() => navigate("/login")} className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-900">
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
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <FaUserCircle className="h-8 w-8 text-gray-700" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.firstName} {user.lastName}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/profile" 
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
                >
                  Profile Settings
                </Link>
                <Link 
                  to="/dashboard/interested-properties" 
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
                >
                  Interested Properties
                </Link>
                <Link 
                  to="/dashboard/bidding-history" 
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
                >
                  Bidding History
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;