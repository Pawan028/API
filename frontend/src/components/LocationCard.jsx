 // LocationCard.js
import React, { useState, useEffect, forwardRef } from 'react';
import { useCheckLocationMutation } from '../slices/apiSlice';

const LocationCard = forwardRef(({ setShowCard }, ref) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [checkLocation, { data, error, isLoading }] = useCheckLocationMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    localStorage.setItem('location', JSON.stringify({ city, state, pincode }));
    try {
      await checkLocation(pincode).unwrap();
    } catch (err) {
      console.error('Failed to check location:', err);
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setCity(location.city || '');
      setState(location.state || '');
      setPincode(location.pincode || '');
    }
  }, []);

  return (
    <div
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 ${setShowCard ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      ref={ref
      }
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Check Your Location</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-gray-700 mb-1">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors duration-200 ${isLoading ? 'bg-blue-400' : 'hover:bg-blue-700'}`}
        >
          {isLoading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>
      {data && (
        <p className="mt-4 text-center text-green-600 font-semibold">
          {data.available ? 'Fast delivery available' : 'Fast delivery not available'}
        </p>
      )}
      {error && <p className="mt-4 text-red-600 font-semibold text-center">Error: {error.message}</p>}
    </div>
  );
});

export default LocationCard;
