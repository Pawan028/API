import { fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice';


// Customize baseQuery to handle JWT expiration and logout
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User', 'Location'],
  endpoints: (builder) => ({
    listLocations: builder.query({
      query: () => '/api/locations',
      providesTags: ['Location'],
    }),
    addLocation: builder.mutation({
      query: (location) => ({
        url: '/api/locations',
        method: 'POST',
        body: location,
      }),
      invalidatesTags: ['Location'],
    }),
    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/api/locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
    updateLocation: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/api/locations/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Location'],
    }),
    checkLocation: builder.mutation({
      query: (pincode) => ({
        url: '/api/locations/check',
        method: 'POST',
        body: { pincode },
      }),
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useListLocationsQuery,
  useAddLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationMutation, // Ensure this is exported
  useCheckLocationMutation,
} = apiSlice;
