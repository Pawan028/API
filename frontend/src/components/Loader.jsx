import React from 'react';
import '../assets/styles/Loader.css'; // Import the CSS file for styling

const Loader = () => {
  return (
    <div className="loader fixed inset-0 flex items-center justify-center  z-50">
      <div className="inner one"></div>
      <div className="inner two"></div>
      <div className="inner three"></div>
    </div>
  );
};

export default Loader;
