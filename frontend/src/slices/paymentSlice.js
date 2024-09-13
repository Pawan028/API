import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice'; // Assuming apiSlice is properly set up

// Async actions are not needed here since we will use the apiSlice for requests
const initialState = {
  order: null,
  isLoading: false,
  error: null,
  success: false,
  paymentVerificationStatus: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.paymentVerificationStatus = null;
    },
  },
  extraReducers: (builder) => {
    // Use the endpoints provided by apiSlice instead of Axios thunks
    builder
      .addMatcher(
        apiSlice.endpoints.createOrder.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.createOrder.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.success = true;
          state.order = action.payload.order;
        }
      )
      .addMatcher(
        apiSlice.endpoints.createOrder.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || 'Failed to create the order';
        }
      )
      .addMatcher(
        apiSlice.endpoints.verifyPayment.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.verifyPayment.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.paymentVerificationStatus = action.payload.success;
        }
      )
      .addMatcher(
        apiSlice.endpoints.verifyPayment.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || 'Payment verification failed';
        }
      );
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;
