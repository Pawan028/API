import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Unique Loading Animation */}
        <div className="flex justify-center space-x-4">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-white text-4xl font-extrabold mt-10 tracking-wide animate-fade-in">
          Welcome to EcoMart
        </h1>

        {/* Subtext Animation */}
        <p className="text-gray-300 mt-2 text-xl animate-fade-in-up">
          Your Eco-Friendly Marketplace
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
