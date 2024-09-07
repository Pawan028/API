import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': paypal.clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid && !window.paypal) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) =>
    actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });

  const onError = (err) => {
    toast.error(err.message);
  };

  const createOrder = (data, actions) =>
    actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    }).then((orderID) => orderID);

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
            {userInfo && !userInfo.isAdmin && (
              <div className="mt-4">
                <Link to={`/track-order/${order._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Track Order Status
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
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

              {!order.isPaid && (
                <li className="mt-4">
                  {loadingPay && <Loader />}
                  {isPending ? <Loader /> : (
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                  )}
                </li>
              )}

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li className="mt-4">
                  <button onClick={deliverHandler} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                    Mark As Delivered
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
