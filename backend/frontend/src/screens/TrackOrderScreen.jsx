import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import '../assets/styles/OrderProgress.css';
import { useEffect } from 'react';

const TrackOrderScreen = () => {
  const { id } = useParams();
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(id);

  // Use useEffect to refetch data periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // Adjust the interval time (in milliseconds) as needed

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [refetch]);

  // Render loading or error states
  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  // Check if order and its properties are defined
  const status = order?.status || {};
  const timestamps = order?.timestamps || {};

  return (
    <>
      <h1>Track Order</h1>
      <Row>
        <Col md={8}>
          <h2>Order Status</h2>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item className={`progress-list-group-item ${status.confirmed ? 'complete' : 'pending'}`}>
                <span className="progress-checkpoint"></span>
                Order Confirmed <span>{timestamps.confirmed ? new Date(timestamps.confirmed).toLocaleString() : 'Pending'}</span>
              </ListGroup.Item>
              <ListGroup.Item className={`progress-list-group-item ${status.placed ? 'complete' : 'pending'}`}>
                <span className="progress-checkpoint"></span>
                Order Placed <span>{timestamps.placed ? new Date(timestamps.placed).toLocaleString() : 'Pending'}</span>
              </ListGroup.Item>
              <ListGroup.Item className={`progress-list-group-item ${status.shipped ? 'complete' : 'pending'}`}>
                <span className="progress-checkpoint"></span>
                Shipped <span>{timestamps.shipped ? new Date(timestamps.shipped).toLocaleString() : 'Pending'}</span>
              </ListGroup.Item>
              <ListGroup.Item className={`progress-list-group-item ${status.outForDelivery ? 'complete' : 'pending'}`}>
                <span className="progress-checkpoint"></span>
                Out for Delivery <span>{timestamps.outForDelivery ? new Date(timestamps.outForDelivery).toLocaleString() : 'Pending'}</span>
              </ListGroup.Item>
              <ListGroup.Item className={`progress-list-group-item ${status.delivered ? 'complete' : 'pending'}`}>
                <span className="progress-checkpoint"></span>
                Delivered <span>{timestamps.delivered ? new Date(timestamps.delivered).toLocaleString() : 'Expected within 2 hours'}</span>
              </ListGroup.Item>
              {status.delivered && (
                <ListGroup.Item className="progress-list-group-item complete">
                  Thank you for shopping!
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TrackOrderScreen;
