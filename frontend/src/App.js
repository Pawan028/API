import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import './index.css'; 
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import SplashScreen from './components/SplashScreen';
import 'react-toastify/dist/ReactToastify.css';
import LocationCard from './components/LocationCard';

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false); 
  const [locationSet, setLocationSet] = useState(false); 

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleLocationSet = () => {
    setLocationSet(true); 
    setShowCard(false); 
  };

  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <ToastContainer />
          <Header setShowCard={setShowCard} />
          <main className='py-3'>
            <Container>
              <Outlet />
            </Container>
          </main>
          <Footer />
          {showCard && !locationSet && (
            <LocationCard 
              setShowCard={setShowCard} 
              onLocationSet={handleLocationSet}
            />
          )}
        </>
      )}
    </>
  );
};

export default App;
