import React, { useState } from 'react';
import { Button, Table, Form, Row, Col } from 'react-bootstrap';
import { useListLocationsQuery, useAddLocationMutation, useDeleteLocationMutation, useUpdateLocationMutation } from '../../slices/apiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import "../../assets/styles/LocationScreen.css"; // Updated CSS import

const AdminLocationScreen = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedId, setSelectedId] = useState(null); // For update

  const { data: locations = [], error, isLoading, refetch } = useListLocationsQuery();
  const [addLocation] = useAddLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();
  const [updateLocation] = useUpdateLocationMutation(); // Ensure this is used

  const addLocationHandler = async (e) => {
    e.preventDefault();
    try {
      await addLocation({ city, state, pincode }).unwrap();
      setCity('');
      setState('');
      setPincode('');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const updateLocationHandler = async (e) => {
    e.preventDefault();
    try {
      await updateLocation({ id: selectedId, city, state, pincode }).unwrap();
      setCity('');
      setState('');
      setPincode('');
      setSelectedId(null); // Reset after update
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteLocation(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete location:', err);
      }
    }
  };
  

  return (
    <div className='location-container'>
      <Row className='align-items-center'>
        <Col>
          <h1 className='location-title'>Manage Locations</h1>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h2 className='location-subtitle'>{selectedId ? 'Update Location' : 'Add New Location'}</h2>
          <Form onSubmit={selectedId ? updateLocationHandler : addLocationHandler} className='location-form'>
            <Form.Group controlId='city'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className='location-input'
              />
            </Form.Group>

            <Form.Group controlId='state'>
              <Form.Label>State</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter state'
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className='location-input'
              />
            </Form.Group>

            <Form.Group controlId='pincode'>
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter pincode'
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                className='location-input'
              />
            </Form.Group>

            <Button type='submit' variant='primary' className='location-btn'>
              {selectedId ? 'Update Location' : 'Add Location'}
            </Button>
          </Form>
        </Col>
        <Col md={8}>
          <h2 className='location-subtitle'>Locations</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error.message}</Message>
          ) : (
            <Table striped bordered hover responsive className='location-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CITY</th>
                  <th>STATE</th>
                  <th>PINCODE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location._id}>
                    <td>{location._id}</td>
                    <td>{location.city}</td>
                    <td>{location.state}</td>
                    <td>{location.pincode}</td>
                    <td>
                      <Button
                        variant='danger'
                        className='btn-sm location-btn-delete'
                        onClick={() => deleteHandler(location._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant='warning'
                        className='btn-sm location-btn-edit'
                        onClick={() => {
                          setCity(location.city);
                          setState(location.state);
                          setPincode(location.pincode);
                          setSelectedId(location._id);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminLocationScreen;
