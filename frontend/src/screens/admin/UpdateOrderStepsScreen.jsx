import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, useUpdateOrderStatusMutation, useUpdateOrderPaymentMutation } from '../../slices/ordersApiSlice';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import '../../assets/styles/UpdateOrderStepsScreen.css';

const AdminUpdateOrderStepsScreen = () => {
  const { id } = useParams();
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(id);
  const [updateOrderStatus, { isLoading: isLoadingUpdate }] = useUpdateOrderStatusMutation();
  const [updateOrderPayment] = useUpdateOrderPaymentMutation(); // Import the new mutation
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (status) {
      const updatedStatus = status === 'delivered' ? 'delivered' : status;
      await updateOrderStatus({ id, status: updatedStatus, date });
      setStatus('');
      setDate('');
      toast.success('Order status updated successfully!'); // Show toast on successful update

      // Refresh the order details after the status update
      refetch();
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await updateOrderPayment({ id, isPaid: true }).unwrap();
      refetch(); // Refresh the order details to update payment status
      toast.success('Order marked as paid.'); // Use toast for notifications
    } catch (error) {
      toast.error('Failed to mark order as paid.'); // Use toast for notifications
    }
  };

  const getProgress = () => {
    const steps = ['confirmed', 'placed', 'shipped', 'outForDelivery', 'delivered'];
    const currentStep = steps.indexOf(order?.status) + 1;
    return (currentStep / steps.length) * 100;
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <>
      <h1>Update Delivery Steps</h1>
      <Form onSubmit={submitHandler} className='update-form'>
        <Form.Group controlId='status'>
          <Form.Label>Status</Form.Label>
          <Form.Control
            as='select'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value=''>Select Status</option>
            <option value='confirmed'>Order Confirmed</option>
            <option value='placed'>Order Placed</option>
            <option value='shipped'>Shipped</option>
            <option value='outForDelivery'>Out for Delivery</option>
            <option value='delivered'>Delivered</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='date'>
          <Form.Label>Date</Form.Label>
          <Form.Control
            type='datetime-local'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button 
        type='submit' 
        variant='primary' 
        className='mt-3 w-40' // Tailwind class for fixed width
        disabled={isLoadingUpdate}
      >
        Update Status
      </Button>
      <Button 
        variant='success' 
        className='mt-3 ml-2 w-40' // Tailwind class for fixed width
        onClick={handleMarkAsPaid}
        disabled={order.isPaid} // Disable button if already paid
      >
        Mark as Paid
      </Button>
      </Form>

      

      <h2 className='mt-5'>Delivery Progress</h2>
      <Row>
        <Col md={12}>
          <Card className='progress-card'>
            <div className='progress-bar-container'>
              <div className='progress-bar' style={{ width: `${getProgress()}%` }}></div>
            </div>
            <div className='progress-checkpoints'>
              <div className={`checkpoint ${order?.status === 'confirmed' ? 'complete' : ''}`}>
                <span className='checkpoint-dot'></span> Order Confirmed
                <div className='timestamp'>
                  {order?.timestamps?.confirmed ? new Date(order.timestamps.confirmed).toLocaleString() : ''}
                </div>
              </div>
              <div className={`checkpoint ${order?.status === 'placed' ? 'complete' : ''}`}>
                <span className='checkpoint-dot'></span> Order Placed
                <div className='timestamp'>
                  {order?.timestamps?.placed ? new Date(order.timestamps.placed).toLocaleString() : ''}
                </div>
              </div>
              <div className={`checkpoint ${order?.status === 'shipped' ? 'complete' : ''}`}>
                <span className='checkpoint-dot'></span> Shipped
                <div className='timestamp'>
                  {order?.timestamps?.shipped ? new Date(order.timestamps.shipped).toLocaleString() : ''}
                </div>
              </div>
              <div className={`checkpoint ${order?.status === 'outForDelivery' ? 'complete' : ''}`}>
                <span className='checkpoint-dot'></span> Out for Delivery
                <div className='timestamp'>
                  {order?.timestamps?.outForDelivery ? new Date(order.timestamps.outForDelivery).toLocaleString() : ''}
                </div>
              </div>
              <div className={`checkpoint ${order?.status === 'delivered' ? 'complete' : ''}`}>
                <span className='checkpoint-dot'></span> Delivered
                <div className='timestamp'>
                  {order?.timestamps?.delivered ? new Date(order.timestamps.delivered).toLocaleString() : 'Expected within 2 hours'}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
    </>
  );
};

export default AdminUpdateOrderStepsScreen;
