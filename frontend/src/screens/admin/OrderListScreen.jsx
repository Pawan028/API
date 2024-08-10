// AdminOrderScreen.js
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery, useUpdateOrderPaymentMutation, useUpdateOrderDeliveryMutation } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderPayment] = useUpdateOrderPaymentMutation();
  const [updateOrderDelivery] = useUpdateOrderDeliveryMutation();
  const [setSelectedOrder] = useState(null);

  const handlePaymentUpdate = async (orderId) => {
    await updateOrderPayment({ id: orderId, isPaid: true });
    refetch();
  };

  const handleDeliveryUpdate = async (orderId) => {
    await updateOrderDelivery({ id: orderId, isDelivered: true });
    refetch();
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <h1>Orders</h1>
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
              <th>DETAILS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} onClick={() => handleSelectOrder(order)}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/order/${order._id}`}
                    variant='light'
                    className='btn-sm'
                  >
                    Details
                  </Button>
                </td>
                <td>
                  {!order.isPaid && (
                    <Button
                      onClick={() => handlePaymentUpdate(order._id)}
                      variant='primary'
                      className='btn-sm'
                    >
                      Mark as Paid
                    </Button>
                  )}
                  {!order.isDelivered && (
                    <Button
                      onClick={() => handleDeliveryUpdate(order._id)}
                      variant='primary'
                      className='btn-sm'
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
