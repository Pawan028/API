import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { PAYMENT_METHOD_PAYPAL, PAYMENT_METHOD_RAZORPAY_CARD, PAYMENT_METHOD_RAZORPAY_UPI, PAYMENT_METHOD_COD } from '../constants';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD_PAYPAL);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>

            <Form.Check
              className='my-2'
              type='radio'
              label='Razorpay Card'
              id={PAYMENT_METHOD_RAZORPAY_CARD}
              name='paymentMethod'
              value={PAYMENT_METHOD_RAZORPAY_CARD}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              className='my-2'
              type='radio'
              label='Razorpay UPI'
              id={PAYMENT_METHOD_RAZORPAY_UPI}
              name='paymentMethod'
              value={PAYMENT_METHOD_RAZORPAY_UPI}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              className='my-2'
              type='radio'
              label='Cash on Delivery'
              id={PAYMENT_METHOD_COD}
              name='paymentMethod'
              value={PAYMENT_METHOD_COD}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
