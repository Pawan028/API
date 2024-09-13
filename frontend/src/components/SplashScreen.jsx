import React from 'react';
import '../assets/styles/SplashScreen.css'; // Import your CSS file

const SplashScreen = () => {
  return (
     <div className="welcome fixed inset-0 bg-[#512da8] flex items-center justify-center overflow-hidden">
      <div className="splash"></div>
      <div id="welcome" className="flex items-center justify-center">
        {/* Logo with Animation */}
        <div className="logo-container">
          <div className="logo"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
