import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { PAYMENT_METHOD_COD, PAYMENT_METHOD_RAZORPAY } from '../constants';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Redirect to shipping if no address is found
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  // State to store the selected payment method
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD_COD);
  const dispatch = useDispatch();

  // Handle form submission and navigate to place order page
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen   flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 space-y-6 transform transition-transform duration-500 hover:scale-105">
        <CheckoutSteps step1 step2 step3 />
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Select Payment Method</h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-md transition-transform duration-300 hover:bg-blue-100">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value={PAYMENT_METHOD_COD}
              checked={paymentMethod === PAYMENT_METHOD_COD}
              onChange={() => setPaymentMethod(PAYMENT_METHOD_COD)}
              className="form-radio h-6 w-6 text-blue-500"
            />
            <label htmlFor="cod" className="ml-4 text-lg font-semibold text-gray-800">Cash on Delivery</label>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-md transition-transform duration-300 hover:bg-blue-100">
            <input
              type="radio"
              id="online"
              name="paymentMethod"
              value={PAYMENT_METHOD_RAZORPAY}
              checked={paymentMethod === PAYMENT_METHOD_RAZORPAY}
              onChange={() => setPaymentMethod(PAYMENT_METHOD_RAZORPAY)}
              className="form-radio h-6 w-6 text-blue-500"
            />
            <label htmlFor="online" className="ml-4 text-lg font-semibold text-gray-800">Online Payment (Razorpay)</label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
