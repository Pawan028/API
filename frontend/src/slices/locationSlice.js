import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    locations: [],
    available: null,
    loading: false,
    error: null,
    successAdd: false,
    successDelete: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.listLocations.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        apiSlice.endpoints.listLocations.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.locations = payload;
        }
      )
      .addMatcher(
        apiSlice.endpoints.listLocations.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
        }
      )
      .addMatcher(
        apiSlice.endpoints.addLocation.matchFulfilled,
        (state, { payload }) => {
          state.successAdd = true;
          state.locations.push(payload);
        }
      )
      .addMatcher(
        apiSlice.endpoints.deleteLocation.matchFulfilled,
        (state, { meta: { arg: id } }) => {
          state.successDelete = true;
          state.locations = state.locations.filter(
            (location) => location._id !== id
          );
        }
      )
      .addMatcher(
        apiSlice.endpoints.checkLocation.matchFulfilled,
        (state, { payload }) => {
          state.available = payload.available;
        }
      );
  },
});

export default locationSlice.reducer; // Ensure this export is correct
