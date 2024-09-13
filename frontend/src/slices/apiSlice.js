import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'Payment', 'User', 'Location'],
  endpoints: (builder) => ({
    // Existing location endpoints
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

    fetchStats: builder.query({
      query: () => '/api/admin/stats',
      providesTags: ['User', 'Product', 'Order', 'Location'],
    }),
  
  }),
});

export const {
  useListLocationsQuery,
  useAddLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
  useCheckLocationMutation,
  useFetchStatsQuery,
} = apiSlice;
