import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation, useCreateRazorpayOrderMutation, useVerifyPaymentMutation } from '../slices/ordersApiSlice'; 
import { PAYMENT_METHOD_COD, PAYMENT_METHOD_RAZORPAY } from '../constants';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async (response, razorpayOrderId, orderId) => {
    try {
      const verifyResponse = await verifyPayment({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: orderId,
      }).unwrap();
  
      if (verifyResponse.success) {
        dispatch(clearCartItems());
        navigate(`/order/${verifyResponse.order._id}`);
        toast.success('Order placed successfully!');
      } else {
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment verification failed');
      console.error('Payment verification error:', error);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load Razorpay SDK. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const order = await createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: PAYMENT_METHOD_RAZORPAY,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        isPaid: false,
      }).unwrap();

      const razorpayOrder = await createRazorpayOrder({
        amount: cart.totalPrice * 100,
      }).unwrap();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'EcoMart',
        description: 'Thank you for your order!',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          await handlePaymentSuccess(response, razorpayOrder.id, order._id);
          setLoading(false);
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('An error occurred while processing your payment');
      console.error('Razorpay payment error:', error);
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    setLoading(true);
    try {
      const order = await createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: PAYMENT_METHOD_COD,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        isPaid: false,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
      toast.success('Order placed successfully!');
      setLoading(false);
    } catch (err) {
      toast.error('Error placing COD order');
      console.error('COD order error:', err);
      setLoading(false);
    }
  };

  const placeOrderHandler = async () => {
    if (paymentMethod === PAYMENT_METHOD_RAZORPAY) {
      await handleRazorpayPayment();
    } else if (paymentMethod === PAYMENT_METHOD_COD) {
      await handleCODPayment();
    } else {
      toast.error('Invalid payment method');
    }
  };

  return (
    <div className="min-h-screen  flex flex-col p-6 md:p-12">
      {loading || isCreatingOrder ? <Loader /> : null}
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-md p-6 space-y-6">
        <CheckoutSteps step1 step2 step3 step4 />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Place Your Order</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
              <p className="text-gray-600">
                <strong>Method:</strong> {paymentMethod}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="ml-4 flex-1">
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-gray-600">{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Items</span>
                <span>₹{cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{cart.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <button
                type="button"
                onClick={placeOrderHandler}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                disabled={cartItems.length === 0 || loading || isCreatingOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
