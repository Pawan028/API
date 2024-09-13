import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen'; // Razorpay integration
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';
import UpdateOrderStepsScreen from './screens/admin/UpdateOrderStepsScreen.jsx';
import store from './store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import LocationScreen from './screens/admin/LocationScreen';
import About from './screens/About.jsx';
import ContactUs from './screens/ContactUs.jsx';
import AdminDashboard from './screens/admin/Dashboard.jsx';
import PaymentSuccess from './components/PaymentSuccess';
import FAQ from './screens/FAQ';
import Shop from './screens/Shop';
import AnalyticsDashboard from './screens/admin/Analytic';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/track-order/:id' element={<TrackOrderScreen />} />
        <Route path='/paymentsuccess' element={<PaymentSuccess />} />
      </Route>

      {/* Admin routes */}
      <Route path='' element={<AdminRoute />}>
      <Route path='/admin/dashboard' element={<AdminDashboard />}>
          <Route path='dash' element={<AnalyticsDashboard />} />
          <Route path='userlist' element={<UserListScreen />} />
          <Route path='productlist' element={<ProductListScreen />} />
          <Route path='orderlist' element={<OrderListScreen />} />
          <Route path='locations' element={<LocationScreen />} />
        </Route>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
        <Route path='/admin/update-order/:id' element={<UpdateOrderStepsScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </ChakraProvider>
  </Provider>
);

reportWebVitals();
