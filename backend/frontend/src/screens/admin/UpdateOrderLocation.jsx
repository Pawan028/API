import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useUpdateOrderLocationMutation } from '../../slices/ordersApiSlice';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';

const UpdateOrderLocation = () => {
  const { id } = useParams();
  const [location, setLocation] = useState('');
  const [updateOrderLocation, { error }] = useUpdateOrderLocationMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    await updateOrderLocation({ id, deliveryLocation: location });
  };

  return (
    <>
      <h2>Update Delivery Location</h2>
      {error && <Message variant='danger'>{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='location'>
          <Form.Label>Location</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter delivery location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>
      </Form>
    </>
  );
};

export default UpdateOrderLocation;
