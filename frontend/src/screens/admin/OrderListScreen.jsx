import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import "../../assets/styles/OrderListScreen.css"; // Updated CSS import

const OrderListScreen = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Get current date and time
  const now = new Date();

  // Filter recent orders (done in the past 24 hours)
  const recentOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return now - orderDate <= 24 * 60 * 60 * 1000; // Orders within the last 24 hours
  });

  // Sort orders to show the most recent orders first
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className='order-container'>
      <h1 className='order-title'>Orders</h1>

      {/* Total Orders Count and Recent Orders Done in the Last 24 Hours */}
      <div className="order-summary p-3 bg-white rounded-lg shadow-md mb-4">
        <h2>Total Orders: {orders.length}</h2>
        <h3>Recent Orders (Last 24 Hours): {recentOrders.length}</h3>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>PAYMENT METHOD</th>
              <th>ORDER STATUS</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <span className='badge paid'>
                      <FaCheck /> {order.paidAt ? order.paidAt.substring(0, 10) : 'N/A'}
                    </span>
                  ) : (
                    <span className='badge not-paid'>
                      <FaTimes /> Not Paid
                    </span>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span className='badge delivered'>
                      <FaCheck /> {order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'N/A'}
                    </span>
                  ) : (
                    <span className='badge not-delivered'>
                      <FaTimes /> Not Delivered
                    </span>
                  )}
                </td>
                <td>{order.paymentMethod}</td>
                <td>
                  {order.status?.confirmed ? 'Confirmed' :
                    order.status?.placed ? 'Placed' :
                      order.status?.shipped ? 'Shipped' :
                        order.status?.outForDelivery ? 'Out for Delivery' :
                          order.status?.delivered ? 'Delivered' : 'Pending'}
                </td>
                <td>
                  <Link to={`/order/${order._id}`} className='btn btn-light btn-sm'>
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderListScreen;
