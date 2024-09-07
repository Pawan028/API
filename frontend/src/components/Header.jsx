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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-[#efeff4] text-black shadow-md py-4 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="EcoMart" className="h-10" />
            <span className="ml-2 text-xl font-bold">EcoMart</span>
            <FaMapMarkerAlt
              className="hidden lg:block ml-3 text-xl hover:text-blue-500 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
              onClick={() => setShowCard(!showCard)}
            />
            <span className="hidden lg:block ml-2 text-sm cursor-pointer" onClick={() => setShowCard(!showCard)}>
              Set Location
            </span>
          </Link>

          {/* Sign In / Profile Icon */}
          <div className="lg:hidden flex items-center">
            {userInfo ? (
              <Link to="/profile" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                <FaUser className="text-xl" />
              </Link>
            ) : (
              <Link to="/login" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                <FaUser className="text-xl" />
              </Link>
            )}
          </div>

          {/* Desktop Icons and Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/about" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaInfoCircle className="mr-2" /> About
            </Link>
            <Link to="/contact" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaAddressBook className="mr-2" /> Contact Us
            </Link>
            <SearchBox />
            <Link to="/cart" className="relative group flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            {userInfo ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                  <FaUser className="mr-2" /> Profile
                </Link>
                {userInfo.isAdmin && (
                  <Link to="/admin/dashboard" className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </Link>
                )}
                <button onClick={logoutHandler} className="flex items-center hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-500 transition-transform duration-300 transform hover:scale-110">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden flex flex-col">
          <div className="bg-[#efeff4] text-black py-2 px-4">
            <SearchBox />
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#51b2ee] to-[#4a8eeb] text-black shadow-lg flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center">
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/about" className="flex flex-col items-center">
          <FaInfoCircle className="text-xl" />
          <span className="text-xs">About</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center">
          <FaAddressBook className="text-xl" />
          <span className="text-xs">Contact</span>
        </Link>
        <Link to="/cart" className="relative flex flex-col items-center">
          <FaShoppingCart className="text-xl" />
          <span className="text-xs">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>
        {userInfo ? (
          userInfo.isAdmin ? (
            <Link to="/admin/dashboard" className="flex flex-col items-center">
              <FaTachometerAlt className="text-xl" />
              <span className="text-xs">Dashboard</span>
            </Link>
          ) : (
            <button onClick={() => setShowCard(!showCard)} className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-xs">Location</span>
            </button>
          )
        ) : (
          <Link to="/login" className="flex flex-col items-center">
            <FaUser className="text-xl" />
            <span className="text-xs">Sign In</span>
          </Link>
        )}
        {userInfo && (
          <button onClick={logoutHandler} className="flex flex-col items-center">
            <FaSignOutAlt className="text-xl" />
            <span className="text-xs">Logout</span>
          </button>
        )}
      </div>

      {/* Location Card */}
      {showCard && (
        <div className="absolute z-50 lg:right-0 lg:top-16 lg:w-72">
          <LocationCard setShowCard={setShowCard} ref={cardRef} />
        </div>
      )}

      {/* Content Area */}
      <main className="pt-20">
        {/* Your main content goes here */}
      </main>
    </>
  );
};

export default Header;
