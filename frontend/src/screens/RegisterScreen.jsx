import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validateForm = () => {
    if (name.trim().length < 3 || !/^[A-Za-z\s]+$/.test(name)) {
      toast.error('Name must be at least 3 characters long and contain only letters');
      return false;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (validateForm()) {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="absolute inset-0 opacity-40"></div>
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>

        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Form.Group className='my-4' controlId='name'>
            <Form.Label className='text-lg font-semibold text-gray-700'>Name</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 ease-in-out'
            />
            <Form.Control.Feedback type='invalid'>
              Name must be at least 3 characters long and contain only letters.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='my-4' controlId='email'>
            <Form.Label className='text-lg font-semibold text-gray-700'>Email Address</Form.Label>
            <Form.Control
              required
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 ease-in-out'
            />
            <Form.Control.Feedback type='invalid'>
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='my-4' controlId='password'>
            <Form.Label className='text-lg font-semibold text-gray-700'>Password</Form.Label>
            <Form.Control
              required
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 ease-in-out'
            />
            <Form.Control.Feedback type='invalid'>
              Password must be at least 6 characters.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='my-4' controlId='confirmPassword'>
            <Form.Label className='text-lg font-semibold text-gray-700'>Confirm Password</Form.Label>
            <Form.Control
              required
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 ease-in-out'
            />
            <Form.Control.Feedback type='invalid'>
              Please confirm your password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            disabled={isLoading}
            type='submit'
            variant='primary'
            className='w-full py-2 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-transform duration-300 ease-in-out'
          >
            Register
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
          <Col className='text-center'>
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-green-600 hover:underline'>
              Login
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegisterScreen;
