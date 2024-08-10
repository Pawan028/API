import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaHome, FaInfoCircle, FaAddressBook, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import LocationCard from './LocationCard';
import '../assets/styles/Header.css';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null); // Ref for the location card

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      localStorage.removeItem('location'); // Clear location on logout
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && showCard) {
        setShowCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setShowCard(false); // Optionally, set card state based on saved location
    }
  }, []);

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img src={logo} alt='EcoMart' />
            EcoMart
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link as={Link} to='/'>
                <FaHome /> Home
              </Nav.Link>
              <Nav.Link as={Link} to='/about'>
                <FaInfoCircle /> About
              </Nav.Link>
              <Nav.Link as={Link} to='/contact'>
                <FaAddressBook /> Contact
              </Nav.Link>
              <Nav.Link onClick={() => setShowCard(!showCard)}>
                <FaMapMarkerAlt /> Set Location
              </Nav.Link>
            </Nav>
            <Nav className='ms-auto'>
              <SearchBox />
              <Nav.Link as={Link} to='/cart'>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <NavDropdown.Item as={Link} to='/profile'>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='adminmenu'>
                      <NavDropdown.Item as={Link} to='/admin/productlist'>
                        Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to='/admin/orderlist'>
                        Orders
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to='/admin/userlist'>
                        Users
                      </NavDropdown.Item><NavDropdown.Item as={Link} to='/admin/locations'>
                        Locations
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showCard && <LocationCard setShowCard={setShowCard} ref={cardRef} />}
    </header>
  );
};

export default Header;
