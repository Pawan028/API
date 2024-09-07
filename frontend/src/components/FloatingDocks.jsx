import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaAddressBook, FaMapMarkerAlt, FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import '../assets/styles/FloatingDock.css'; // Add custom styling for the dock.

const dockItems = [
  {
    title: "Home",
    icon: <FaHome className="h-6 w-6 text-neutral-300 hover:text-white transition duration-200 ease-in-out" />,
    href: "/",
  },
  {
    title: "About",
    icon: <FaInfoCircle className="h-6 w-6 text-neutral-300 hover:text-white transition duration-200 ease-in-out" />,
    href: "/about",
  },
  {
    title: "Contact",
    icon: <FaAddressBook className="h-6 w-6 text-neutral-300 hover:text-white transition duration-200 ease-in-out" />,
    href: "/contact",
  },
  {
    title: "Set Location",
    icon: <FaMapMarkerAlt className="h-6 w-6 text-neutral-300 hover:text-white transition duration-200 ease-in-out" />,
    href: "#",
  },
  {
    title: "Cart",
    icon: <FaShoppingCart className="h-6 w-6 text-neutral-300 hover:text-white transition duration-200 ease-in-out" />,
    href: "/cart",
  },
];

const FloatingDock = ({ userInfo, setShowCard, setLocationSet }) => {
  const [isOpen, setIsOpen] = useState(false); // State for dock open/close

  const toggleDock = () => {
    setIsOpen(!isOpen);
  };

  const handleSetLocation = () => {
    setShowCard(true);
    setLocationSet(true); // Notify parent that location has been set
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.floating-dock')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-x-0 bottom-0 flex flex-col items-center z-50">
      <button
        onClick={toggleDock}
        className="p-4 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-900 transition-transform transform hover:scale-110"
      >
        <FaBars />
      </button>
      
      {isOpen && (
        <div className="floating-dock flex flex-col items-center gap-2 bg-neutral-700 rounded-lg shadow-md p-4 mt-2">
          {dockItems.map((item, index) => (
            <Link
              to={item.href}
              key={index}
              onClick={item.title === "Set Location" ? handleSetLocation : null}
              className="flex flex-col items-center text-neutral-300 hover:text-white transition duration-200 ease-in-out"
            >
              {item.icon}
              <span className="mt-2 text-sm">{item.title}</span>
            </Link>
          ))}
          {userInfo && (
            <Link
              to="/profile"
              className="flex flex-col items-center text-neutral-300 hover:text-white transition duration-200 ease-in-out"
            >
              <FaUser className="h-6 w-6" />
              <span className="mt-2 text-sm">{userInfo.name}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingDock;
