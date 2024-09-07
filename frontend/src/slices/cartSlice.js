import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Destructure payload to exclude unnecessary fields
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Update existing item in the cart
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Add new item to cartItems array
        state.cartItems.push(item);  // Use `push` instead of array reassignment
      }

      updateCart(state);  // Update local storage and state
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCart(state);  // Update after removal
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => {
      // Reset cart state completely
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
