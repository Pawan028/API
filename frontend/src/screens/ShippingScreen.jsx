import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [state, setState] = useState(shippingAddress.state || '');
  const [pincode, setPincode] = useState(shippingAddress.pincode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [contactNumber, setContactNumber] = useState(shippingAddress.contactNumber || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateContactNumber = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateContactNumber(contactNumber)) {
      toast.error('Please enter a valid Indian contact number.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (!pincode) {
      toast.error('Pincode is required.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    dispatch(saveShippingAddress({ address, city, state, pincode, country, contactNumber }));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 space-y-6 transform transition-transform duration-500 hover:scale-105">
        <ToastContainer />
        <CheckoutSteps step1 step2 />
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">Shipping Details</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="address" className="text-lg font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="text-lg font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="state" className="text-lg font-medium text-gray-700">State</label>
            <input
              type="text"
              id="state"
              placeholder="Enter state"
              value={state}
              required
              onChange={(e) => setState(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="pincode" className="text-lg font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              id="pincode"
              placeholder="Enter pincode"
              value={pincode}
              required
              onChange={(e) => setPincode(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="country" className="text-lg font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="contactNumber" className="text-lg font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              placeholder="Enter contact number"
              value={contactNumber}
              required
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
