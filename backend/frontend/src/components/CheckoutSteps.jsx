// CheckoutSteps.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/styles/CheckoutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='checkout-steps'>
      <Nav.Item className={step1 ? 'active' : 'disabled'}>
        {step1 ? (
          <Nav.Link as={Link} to='/login' className='nav-link active'>
            Sign In
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='nav-link'>
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step2 ? 'active' : 'disabled'}>
        {step2 ? (
          <Nav.Link as={Link} to='/shipping' className='nav-link active'>
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='nav-link'>
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step3 ? 'active' : 'disabled'}>
        {step3 ? (
          <Nav.Link as={Link} to='/payment' className='nav-link active'>
            Payment
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='nav-link'>
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step4 ? 'active' : 'disabled'}>
        {step4 ? (
          <Nav.Link as={Link} to='/placeorder' className='nav-link active'>
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='nav-link'>
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
