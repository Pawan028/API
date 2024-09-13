 // CheckoutSteps.js
import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-around mb-6">
      {/** Step 1 **/}
      <div className={`relative flex flex-col items-center transition-transform duration-300 ${step1 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step1 ? 'border-blue-600' : 'border-gray-400'} transition-colors duration-300`}>
          {step1 ? (
            <Link to="/login" className="font-semibold hover:text-blue-800">
              1
            </Link>
          ) : (
            <span className="font-semibold cursor-not-allowed">1</span>
          )}
        </div>
        <span className="mt-2 font-semibold">Sign In</span>
      </div>

      {/** Step 2 **/}
      <div className={`relative flex flex-col items-center transition-transform duration-300 ${step2 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step2 ? 'border-blue-600' : 'border-gray-400'} transition-colors duration-300`}>
          {step2 ? (
            <Link to="/shipping" className="font-semibold hover:text-blue-800">
              2
            </Link>
          ) : (
            <span className="font-semibold cursor-not-allowed">2</span>
          )}
        </div>
        <span className="mt-2 font-semibold">Shipping</span>
      </div>

       {/** Step 3 **/}
      <div className={`relative flex flex-col items-center transition-transform duration-300 ${step3 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step3 ? 'border-blue-600' : 'border-gray-400'} transition-colors duration-300`}>
          {step3 ? (
            <Link to="/payment" className="font-semibold hover:text-blue-800">
              3
            </Link>
          ) : (
            <span className="font-semibold cursor-not-allowed">3</span>
          )}
        </div>
        <span className="mt-2 font-semibold">Payment</span>
      </div>

      {/** Step 4 **/}
      <div className={`relative flex flex-col items-center transition-transform duration-300 ${step4 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step4 ? 'border-blue-600' : 'border-gray-400'} transition-colors duration-300`}>
          {step4 ? (
            <Link to="/placeorder" className="font-semibold hover:text-blue-800">
              4
            </Link>
          ) : (
            <span className="font-semibold cursor-not-allowed">4</span>
          )}
        </div>
        <span className="mt-2 font-semibold">Place Order</span>
      </div>

       
    </div>
  );
};

export default CheckoutSteps;
