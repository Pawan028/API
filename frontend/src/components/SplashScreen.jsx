import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#1eafe3] via-[#dcdde6] to-[#1eafe3] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Unique Loading Animation */}
        <div className="flex justify-center space-x-4">
          <div className="w-4 h-4 bg-[#1eafe3] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-[#e5402e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-[#30e345] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-4 h-4 bg-[#3276eb] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-4 h-4 bg-[#1eafe3] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-[#386ae9] text-4xl font-extrabold mt-10 tracking-wide animate-fade-in">
          Welcome to EcoMart
        </h1>

        {/* Subtext Animation */}
        <p className="text-[#386ae9] mt-2 text-xl animate-fade-in-up">
          Your Eco-Friendly Marketplace
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
