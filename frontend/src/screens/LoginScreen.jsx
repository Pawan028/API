import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
 

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-moving-pattern bg-cover bg-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className='my-4' controlId='email'>
            <Form.Label className='text-lg font-semibold'>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 ease-in-out'
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-4' controlId='password'>
            <Form.Label className='text-lg font-semibold'>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 ease-in-out'
            ></Form.Control>
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className='w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-transform duration-300 ease-in-out'
          >
            Sign In
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
          <Col className='text-center'>
            New Customer?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className='text-indigo-600 hover:underline'>
              Register
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginScreen;
