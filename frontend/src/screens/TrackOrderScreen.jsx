import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useEffect } from 'react';

const TrackOrderScreen = () => {
  const { id } = useParams();
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(id);

  // Refetch data periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  const status = order?.status || {};
  const timestamps = order?.timestamps || {};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6">Order Status</h2>
          <ul className="space-y-4">
            {/* Status Items */}
            <li className={`relative p-4 rounded-lg shadow-md transition-all duration-300 ${status.confirmed ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${status.confirmed ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <div className="ml-8">
                <span className="text-xl font-medium">Order Confirmed</span>
                <span className="block text-sm mt-2">
                  {timestamps.confirmed ? new Date(timestamps.confirmed).toLocaleString() : 'Pending'}
                </span>
              </div>
            </li>

            <li className={`relative p-4 rounded-lg shadow-md transition-all duration-300 ${status.placed ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${status.placed ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <div className="ml-8">
                <span className="text-xl font-medium">Order Placed</span>
                <span className="block text-sm mt-2">
                  {timestamps.placed ? new Date(timestamps.placed).toLocaleString() : 'Pending'}
                </span>
              </div>
            </li>

            <li className={`relative p-4 rounded-lg shadow-md transition-all duration-300 ${status.shipped ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${status.shipped ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <div className="ml-8">
                <span className="text-xl font-medium">Shipped</span>
                <span className="block text-sm mt-2">
                  {timestamps.shipped ? new Date(timestamps.shipped).toLocaleString() : 'Pending'}
                </span>
              </div>
            </li>

            <li className={`relative p-4 rounded-lg shadow-md transition-all duration-300 ${status.outForDelivery ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${status.outForDelivery ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <div className="ml-8">
                <span className="text-xl font-medium">Out for Delivery</span>
                <span className="block text-sm mt-2">
                  {timestamps.outForDelivery ? new Date(timestamps.outForDelivery).toLocaleString() : 'Pending'}
                </span>
              </div>
            </li>

            <li className={`relative p-4 rounded-lg shadow-md transition-all duration-300 ${status.delivered ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${status.delivered ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <div className="ml-8">
                <span className="text-xl font-medium">Delivered</span>
                <span className="block text-sm mt-2">
                  {timestamps.delivered ? new Date(timestamps.delivered).toLocaleString() : 'Expected within 2 hours'}
                </span>
              </div>
            </li>

            {status.delivered && (
              <li className="p-4 bg-green-100 rounded-lg shadow-md">
                <div className="ml-8">
                  <span className="text-xl font-bold">Thank you for shopping with us!</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderScreen;
