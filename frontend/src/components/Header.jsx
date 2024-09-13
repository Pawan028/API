import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaHome, FaInfoCircle, FaAddressBook, FaBars, FaMapMarkerAlt, FaSignOutAlt, FaTachometerAlt, FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.ico';
import { resetCart } from '../slices/cartSlice';
import LocationCard from './LocationCard';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showCard, setShowCard] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State for search bar visibility
  const cardRef = useRef(null); // Ref for the location card
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      localStorage.removeItem('location'); // Clear location on logout
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Toggle search bar visibility
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && isMenuOpen ) {
        setIsMenuOpen(false);
        setShowCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, showCard]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && showCard) {
        setShowCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setShowCard(false); // Optionally, set card state based on saved location
    }
  }, []);

  return (
    <>
      {/* Header Section */}
      <header className="bg-emerald-500 text-white shadow-md top-0 left-0 w-full  h-20">
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="EcoMart" className="h-8" />
            <span className="ml-2 text-lg font-bold">EcoMart</span>
            <FaMapMarkerAlt
              className="hidden lg:block ml-3 text-lg hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
              onClick={() => setShowCard(!showCard)}
            />
            <span className="hidden lg:block ml-2 text-sm hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110 cursor-pointer" onClick={() => setShowCard(!showCard)}>
              Set Location
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <button 
              onClick={toggleSearch} 
              className="p-2 rounded-md hover:bg-emerald-900 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
            >
              <FaSearch className="text-2xl" />
            </button>
            <button 
              onClick={toggleMenu} 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-emerald-900 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
            >
              <FaBars className="text-3xl" />
            </button>
          </div>

          {/* Desktop Icons and Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/" className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/about" className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
              <FaInfoCircle className="mr-2" /> About
            </Link>
            <Link to="/contact" className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
              <FaAddressBook className="mr-2" /> Contact Us
            </Link>
            <SearchBox />
            <Link to="/cart" className="relative group flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
              <FaShoppingCart className="text-lg" />
              {cartItems.length > 0 && (
                <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            {userInfo ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
                  <FaUser className="mr-2" /> Profile
                </Link>
                {userInfo.isAdmin && (
                  <Link to="/admin/dashboard" className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </Link>
                )}
                <button onClick={logoutHandler} className="flex items-center hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-emerald-900 transition-transform duration-300 transform hover:scale-110">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden flex flex-col py-2 px-4">
            <SearchBox />
          </div>
        )}
      </header>

      {/* Mobile Dropdown Menu */}
      <div className="fixed top-[4rem] right-4 z-50">
        {isMenuOpen && (
          <div
            ref={cardRef}
            className="absolute top-10 right-0 w-48 bg-white text-black shadow-lg p-4 z-50 rounded-lg">
            <div className="flex flex-col items-center space-y-3">
              {userInfo ? (
                <div className="flex items-center w-full bg-white">
                  <img
                    className="flex-shrink-0 object-cover rounded-full w-9 h-9"
                    src="https://images.unsplash.com/photo-1611162619969-50b02487f71b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGljb25zfGVufDB8fDB8fHww"
                    alt="User Avatar"
                  />
                  <div className="mx-2">
                    <h1 className="text-sm font-semibold">{userInfo.name}</h1>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-lg font-semibold hover:text-emerald-500">Sign In</Link>
              )}

              <hr className="border-gray-200 w-full" />

              {/* Menu Options with Icons */}
              <Link to="/" className="flex items-center w-full hover:text-emerald-500">
                <FaHome className="mr-2" /> Home
              </Link>
              <Link to="/cart" className="relative flex items-center w-full hover:text-emerald-500">
                <FaShoppingCart className="mr-2" /> Cart
                {cartItems.length > 0 && (
                  <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
              <Link to="/about" className="flex items-center w-full hover:text-emerald-500">
                <FaInfoCircle className="mr-2" /> About
              </Link>
              <Link to="/contact" className="flex items-center w-full hover:text-emerald-500">
                <FaAddressBook className="mr-2" /> Contact
              </Link>
              <Link to="/profile" className="flex items-center w-full hover:text-emerald-500">
                <FaUser className="mr-2" /> Profile
              </Link>
              <button onClick={() => setShowCard(!showCard)} className="flex items-center w-full hover:text-emerald-500">
                <FaMapMarkerAlt className="mr-2" /> Set Location
              </button>

              {userInfo && userInfo.isAdmin && (
                <Link to="/admin/dashboard" className="flex items-center w-full hover:text-emerald-500">
                  <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>
              )}

              {userInfo && (
                <button onClick={logoutHandler} className="flex items-center w-full hover:text-emerald-500">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-gradient-to-t from-black to-[#111826] text-white shadow-lg flex justify-around py-2 z-50">
        {/* Add mobile tab bar items here */}
      </div>

      {/* Location Card */}
      {showCard && (
        <div className="absolute z-50 lg:right-0 lg:top-16 lg:w-72">
          <LocationCard setShowCard={setShowCard} ref={cardRef} />
        </div>
      )}
    </>
  );
};

export default Header;
