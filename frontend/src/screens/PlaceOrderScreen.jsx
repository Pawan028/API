import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { clearCartItems } from '../slices/cartSlice';
import { 
  PAYMENT_METHOD_RAZORPAY_CARD, 
  PAYMENT_METHOD_RAZORPAY_UPI, 
  PAYMENT_METHOD_COD 
} from '../constants';
import axios from 'axios';
import '../assets/styles/PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    setIsLoading(true);

    if (cart.paymentMethod === PAYMENT_METHOD_COD) {
      await handleCODPayment();
    } else if (
      cart.paymentMethod === PAYMENT_METHOD_RAZORPAY_CARD ||
      cart.paymentMethod === PAYMENT_METHOD_RAZORPAY_UPI
    ) {
      await handleOnlinePayment();
    } else {
      toast.error('Invalid payment method');
    }

    setIsLoading(false);
  };

  const handleCODPayment = async () => {
    try {
      const res = await axios.post('/api/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch(clearCartItems());
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const { data: order } = await axios.post('/api/payments/initiate', {
        amount: cart.totalPrice,
      });

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
        amount: order.amount, // Amount is in paise (1 INR = 100 paise)
        currency: 'INR',
        name: 'Your Store',
        description: 'Test Transaction',
        image: '/logo.png', // Replace with your store logo
        order_id: order.orderId, // Razorpay Order ID
        handler: async (response) => {
          await verifyPaymentAndPlaceOrder(response);
        },
        prefill: {
          name: cart.shippingAddress.name,
          email: cart.shippingAddress.email,
          contact: cart.shippingAddress.contactNumber,
        },
        notes: {
          address: cart.shippingAddress.address,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || 'An error occurred during payment initiation');
    }
  };

  const verifyPaymentAndPlaceOrder = async (paymentResult) => {
    try {
      const res = await axios.post('/api/payments/verify', {
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        orderId: cart.orderId,
      });

      const order = await axios.post('/api/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        paymentResult: res.data.paymentResult,
      });

      dispatch(clearCartItems());
      navigate(`/order/${order.data._id}`);
    } catch (err) {
      toast.error(err.message || 'An error occurred during payment verification');
    }
  };

  return (
    <div>
      <ToastContainer />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.pincode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
