import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaHome, FaInfoCircle, FaAddressBook, FaMapMarkerAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
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
  const cardRef = useRef(null); // Ref for the location card

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
      <header className="bg-[#efeff4] text-black shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="EcoMart" className="h-10" />
            <span className="ml-2 text-xl font-bold">EcoMart</span>
            <FaMapMarkerAlt className="lg:hidden ml-2 text-xl hover:text-blue-500 transition-transform duration-300 transform hover:scale-110" onClick={() => setShowCard(!showCard)} />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            <Link to="/" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaHome className="text-xl" /> <span className="ml-1">Home</span>
            </Link>
            <Link to="/about" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaInfoCircle className="text-xl" /> <span className="ml-1">About</span>
            </Link>
            <Link to="/contact" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaAddressBook className="text-xl" /> <span className="ml-1">Contact</span>
            </Link>
            <button
              onClick={() => setShowCard(!showCard)}
              className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110"
            >
              <FaMapMarkerAlt className="text-xl" /> <span className="ml-1">Set Location</span>
            </button>
          </div>

          {/* Desktop Icons (Search, Cart, User, Dashboard for Admin, Logout) */}
          <div className="hidden lg:flex items-center space-x-4">
            <SearchBox />
            <Link to="/cart" className="flex flex-col items-center relative group">
              <FaShoppingCart className="text-xl transition-transform duration-300 transform group-hover:scale-110" />
              <span className="text-xs">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {userInfo?.isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                <FaTachometerAlt className="text-xl" /> <span className="ml-1">Dashboard</span>
              </Link>
            )}

            {userInfo ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                  <FaUser className="text-xl" /> <span className="ml-1">{userInfo.name}</span>
                </Link>
                <button onClick={logoutHandler} className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                  <FaSignOutAlt className="text-xl" /> <span className="ml-1">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                <FaUser className="text-xl" /> <span className="ml-1">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar and User Icon for Small Screens */}
      <div className="lg:hidden bg-[#54aee6] text-black py-2 flex justify-between px-4">
        <SearchBox />
        {userInfo ? (
          <Link to="/profile" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
            <FaUser className="text-xl" /> <span className="ml-1">{userInfo.name}</span>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
            <FaUser className="text-xl" /> <span className="ml-1">Sign In</span>
          </Link>
        )}
      </div>

      {/* Mobile Tab Bar (Positioned at the Bottom of the Screen) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#51b2ee] to-[#4a8eeb] text-black shadow-lg flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center group">
          <FaHome className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/about" className="flex flex-col items-center group">
          <FaInfoCircle className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs">About</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center group">
          <FaAddressBook className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs">Contact</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center relative group">
          <FaShoppingCart className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        {/* Dashboard and Logout for Admin Users */}
        {userInfo?.isAdmin && (
          <Link to="/admin/dashboard" className="flex flex-col items-center group">
            <FaTachometerAlt className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-xs">Dashboard</span>
          </Link>
        )}

        {/* Logout Button on Mobile Tab Bar */}
        <button onClick={logoutHandler} className="flex flex-col items-center group">
          <FaSignOutAlt className="text-xl transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs">Logout</span>
        </button>
      </div>

      {/* Location Card */}
      {showCard && <LocationCard setShowCard={setShowCard} ref={cardRef} />}
    </>
  );
};

export default Header;
