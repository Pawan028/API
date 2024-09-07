 // src/components/MobileTabBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaAddressBook, FaShoppingCart, FaUser, FaMapMarkerAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations

const MobileTabBar = ({ cartItems, userInfo, onLogout, setShowCard }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white flex justify-around items-center py-2 shadow-lg z-50">
      <Link to="/" className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center"
        >
          <FaHome size={24} />
        </motion.div>
      </Link>
      <Link to="/about" className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center"
        >
          <FaInfoCircle size={24} />
        </motion.div>
      </Link>
      <Link to="/contact" className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center"
        >
          <FaAddressBook size={24} />
        </motion.div>
      </Link>
      {/* Centered icon for dashboard or location */}
      <div className="flex flex-col items-center">
        {userInfo && userInfo.isAdmin ? (
          <Link to="/admin/dashboard" className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              className="flex items-center"
            >
              <FaTachometerAlt size={30} />
            </motion.div>
          </Link>
        ) : (
          <button onClick={() => setShowCard(true)} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center"
            >
              <FaMapMarkerAlt size={24} />
            </motion.div>
          </button>
        )}
      </div>
      <Link to="/cart" className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center relative"
        >
          <FaShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-success text-white rounded-full px-1 text-xs transform translate-x-1/2 translate-y-1/2">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </motion.div>
      </Link>
      {userInfo ? (
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center"
            onClick={onLogout}
          >
            <FaSignOutAlt size={24} />
          </motion.div>
        </div>
      ) : (
        <Link to="/login" className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center"
          >
            <FaUser size={24} />
          </motion.div>
        </Link>
      )}
    </div>
  );
};

export default MobileTabBar;
