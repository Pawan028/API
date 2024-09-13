import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import AdminUpdateOrderStepsScreen from './admin/UpdateOrderStepsScreen'; // Import the AdminUpdateOrderStepsScreen component
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation
} from '../slices/ordersApiSlice'; // Razorpay-related mutation hooks

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [loadingPayOnline, setLoadingPayOnline] = useState(false); // State for Razorpay online payment loading
  const { userInfo } = useSelector((state) => state.auth);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to handle successful Razorpay payment
  const handlePaymentSuccess = async (response, razorpayOrderId) => {
    try {
      const verifyResponse = await verifyPayment({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: orderId,
      }).unwrap();

      if (verifyResponse.success) {
        refetch();  // Refetch the order details to update payment status
        toast.success('Payment successful, order is now paid.');
      } else {
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment verification failed.');
    }
    setLoadingPayOnline(false);
  };

  // Function to handle Razorpay payment
  const handleRazorpayPayment = async () => {
    setLoadingPayOnline(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load Razorpay SDK. Please try again later.');
      setLoadingPayOnline(false);
      return;
    }

    try {
      // First, create the Razorpay order in the backend
      const razorpayOrder = await createRazorpayOrder({
        amount: order.totalPrice * 100, // Amount in paise
      }).unwrap();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Make sure this is set in your .env file
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Your Business Name',
        description: 'Pay for your order',
        order_id: razorpayOrder.id,
        handler: (response) => handlePaymentSuccess(response, razorpayOrder.id),
        prefill: {
          name: order.user.name,
          email: order.user.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('An error occurred while processing your payment.');
      setLoadingPayOnline(false);
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p>
              <strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-500 underline">{order.user.email}</a>
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}, {order.shippingAddress.country}
            </p>
            <p><strong>Contact Number:</strong> {order.shippingAddress.contactNumber}</p>
            {order.isDelivered ? (
              <Message variant="success">Delivered on {order.deliveredAt}</Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
            {order.paymentResult && order.paymentResult.status && (
              <p><strong>Payment Status:</strong> {order.paymentResult.status}</p>
            )}
            {order.paymentResult && order.paymentResult.update_time && (
              <p><strong>Payment Update Time:</strong> {new Date(order.paymentResult.update_time).toLocaleString()}</p>
            )}
          </div>

          {/* Razorpay Info (if available) */}
          {order.razorpay && (
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Razorpay Payment</h2>
              <p><strong>Razorpay Order ID:</strong> {order.razorpay.orderId}</p>
              <p><strong>Razorpay Payment ID:</strong> {order.razorpay.paymentId}</p>
              <p><strong>Verified:</strong> {order.razorpay.verified ? 'Yes' : 'No'}</p>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ul>
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-300 py-2">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg shadow-md mr-4" />
                      <Link to={`/product/${item.product}`} className="text-blue-500 hover:underline">{item.name}</Link>
                    </div>
                    <div>
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <ul>
              <li className="flex justify-between py-2 border-b border-gray-300">
                <span>Items</span>
                <span>₹{order.itemsPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-300">
                <span>Shipping</span>
                <span>₹{order.shippingPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-300">
                <span>Tax</span>
                <span>₹{order.taxPrice}</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-300 font-bold">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </li>

              {/* Pay Online button for COD */}
              {!order.isPaid && order.paymentMethod === 'Cash on Delivery' && (
                <li className="mt-4">
                  {loadingPayOnline && <Loader />}
                  <button
                    onClick={handleRazorpayPayment}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Pay Online
                  </button>
                </li>
              )}

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li className="mt-4">
                  <button
                    onClick={deliverHandler}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Mark As Delivered
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Order Steps */}
      {userInfo && userInfo.isAdmin && (
        <div className="mt-6">
          <AdminUpdateOrderStepsScreen />
        </div>
      )}

      {/* Timestamps for order status */}
      <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Order Timestamps</h2>
        <p><strong>Confirmed:</strong> {order.timestamps.confirmed ? new Date(order.timestamps.confirmed).toLocaleString() : 'N/A'}</p>
        <p><strong>Placed:</strong> {order.timestamps.placed ? new Date(order.timestamps.placed).toLocaleString() : 'N/A'}</p>
        <p><strong>Shipped:</strong> {order.timestamps.shipped ? new Date(order.timestamps.shipped).toLocaleString() : 'N/A'}</p>
        <p><strong>Out for Delivery:</strong> {order.timestamps.outForDelivery ? new Date(order.timestamps.outForDelivery).toLocaleString() : 'N/A'}</p>
        <p><strong>Delivered:</strong> {order.timestamps.delivered ? new Date(order.timestamps.delivered).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default OrderScreen;
