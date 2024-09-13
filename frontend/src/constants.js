 // Base URL for API (empty string if using a proxy)
export const BASE_URL = ''; 

// API Endpoints
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';

// Payment Methods
export const PAYMENT_METHOD_RAZORPAY = 'Razorpay';
export const PAYMENT_METHOD_COD = 'Cash on Delivery';

// Razorpay Integration Endpoints
export const RAZORPAY_KEY_URL = '/api/getkey'; // Endpoint to get Razorpay key
export const RAZORPAY_ORDER_URL = '/api/checkout'; // Endpoint to create a Razorpay order
export const RAZORPAY_PAYMENT_VERIFICATION_URL = '/api/paymentverification'; // Endpoint to verify payment
