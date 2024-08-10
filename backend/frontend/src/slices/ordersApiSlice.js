import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    addDeliveryStep: builder.mutation({
      query: ({ id, location }) => ({
        url: `${ORDERS_URL}/${id}/addStep`,
        method: 'PUT',
        body: { location },
      }),
    }),
    getDeliverySteps: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/steps`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateOrderPayment: builder.mutation({
      query: ({ id, isPaid }) => ({
        url: `${ORDERS_URL}/${id}/updatePayment`,
        method: 'PUT',
        body: { isPaid },
      }),
    }),
    updateOrderDelivery: builder.mutation({
      query: ({ id, isDelivered }) => ({
        url: `${ORDERS_URL}/${id}/updateDelivery`,
        method: 'PUT',
        body: { isDelivered },
      }),
    }),
    updateOrderLocation: builder.mutation({
      query: ({ id, deliveryLocation }) => ({
        url: `${ORDERS_URL}/${id}/updateLocation`,
        method: 'PUT',
        body: { deliveryLocation },
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, date }) => ({
        url: `${ORDERS_URL}/${id}/status`,
        method: 'PUT',
        body: { status, date },
      }),
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useAddDeliveryStepMutation,
  useGetDeliveryStepsQuery,
  useUpdateOrderPaymentMutation,
  useUpdateOrderDeliveryMutation,
  useUpdateOrderLocationMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation
} = orderApiSlice;
