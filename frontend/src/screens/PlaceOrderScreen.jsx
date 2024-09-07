import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { clearCartItems } from '../slices/cartSlice';
import {
  PAYMENT_METHOD_RAZORPAY_CARD,
  PAYMENT_METHOD_RAZORPAY_UPI,
  PAYMENT_METHOD_COD,
} from '../constants';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    setIsLoading(true);
    if (cart.paymentMethod === PAYMENT_METHOD_COD) {
      await handleCODPayment();
    } else if (
      cart.paymentMethod === PAYMENT_METHOD_RAZORPAY_CARD ||
      cart.paymentMethod === PAYMENT_METHOD_RAZORPAY_UPI
    ) {
      await handleOnlinePayment();
    } else {
      toast.error('Invalid payment method');
    }
    setIsLoading(false);
  };

  const handleCODPayment = async () => {
    try {
      const res = await axios.post('/api/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch(clearCartItems());
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const { data: order } = await axios.post('/api/payments/initiate', {
        amount: cart.totalPrice,
      });
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: order.amount,
        currency: 'INR',
        name: 'Your Store',
        description: 'Test Transaction',
        image: '/logo.png',
        order_id: order.orderId,
        handler: async (response) => {
          await verifyPaymentAndPlaceOrder(response);
        },
        prefill: {
          name: cart.shippingAddress.name,
          email: cart.shippingAddress.email,
          contact: cart.shippingAddress.contactNumber,
        },
        notes: {
          address: cart.shippingAddress.address,
        },
        theme: {
          color: '#3399cc',
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || 'An error occurred during payment initiation');
    }
  };

  const verifyPaymentAndPlaceOrder = async (paymentResult) => {
    try {
      const res = await axios.post('/api/payments/verify', {
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        orderId: cart.orderId,
      });
      const order = await axios.post('/api/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        paymentResult: res.data.paymentResult,
      });
      dispatch(clearCartItems());
      navigate(`/order/${order.data._id}`);
    } catch (err) {
      toast.error(err.message || 'An error occurred during payment verification');
    }
  };

  return (
    <div className="animate-fadeIn p-4">
      <ToastContainer />
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold">Shipping</h2>
            <p>
              <strong>Address:</strong> {cart.shippingAddress.address},{' '}
              {cart.shippingAddress.city} {cart.shippingAddress.pincode},{' '}
              {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold">Payment Method</h2>
            <p>
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ul>
                {cart.cartItems.map((item, index) => (
                  <li key={index} className="flex items-center py-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg transform hover:scale-110 transition-transform duration-200"
                    />
                    <div className="flex-1 px-4">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      {item.qty} x ₹{item.price} = ₹
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <div className="my-4">
            <div className="flex justify-between py-2">
              <span>Items</span>
              <span>₹{cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Shipping</span>
              <span>₹{cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax</span>
              <span>₹{cart.taxPrice}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>₹{cart.totalPrice}</span>
            </div>
          </div>
          <button
            className={`w-full py-3 mt-4 bg-blue-600 text-white rounded-lg transform hover:scale-105 transition-transform duration-200 ${
              cart.cartItems.length === 0 || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
