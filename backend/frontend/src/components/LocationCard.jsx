import React, { useState, useEffect, forwardRef } from 'react';
import { useCheckLocationMutation } from '../slices/apiSlice'; // Import the checkLocation hook
import '../assets/styles/LocationCard.css'; // Import the CSS file

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
      // Handle the error if needed
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
    <div className={`location-card ${setShowCard ? 'show' : ''}`} ref={ref}>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='city'>City</label>
          <input
            type='text'
            id='city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='state'>State</label>
          <input
            type='text'
            id='state'
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='pincode'>Pincode</label>
          <input
            type='text'
            id='pincode'
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>
      {data && (
        <p>
          {data.available ? 'Fast delivery available' : 'Fast delivery not available'}
        </p>
      )}
      {error && <p className='error-message'>Error: {error.message}</p>}
    </div>
  );
});

export default LocationCard;
