import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order in the system
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    
    // Create Razorpay order (initiates payment process)
    createRazorpayOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDERS_URL}/razorpay`,
        method: 'POST',
        body: orderData, // This should include amount and other necessary details
      }),
    }),

    // Verify payment after Razorpay process is completed
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: `${ORDERS_URL}/verifypayments`,
        method: 'POST',
        body: paymentData, // This should include razorpay_order_id, razorpay_payment_id, and razorpay_signature
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
  useCreateRazorpayOrderMutation,  // Razorpay order mutation hook
  useVerifyPaymentMutation,        // Razorpay payment verification hook
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useAddDeliveryStepMutation,
  useGetDeliveryStepsQuery,
  useUpdateOrderPaymentMutation,
  useUpdateOrderDeliveryMutation,
  useUpdateOrderLocationMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApiSlice;
