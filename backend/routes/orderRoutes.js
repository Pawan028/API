const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  verifyPayment,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  updateOrderPayment,
  updateOrderDelivery,
  updateOrderLocation,
  addDeliveryStep,
  getDeliverySteps,
  updateOrderStatus,
} = require('../controllers/orderController');

const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/razorpayController.js');


const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems,)
  .get(protect, admin, getOrders);

 
// Create Razorpay Order
router.post('/razorpay', protect, createRazorpayOrder);

// Verify Razorpay Payment
router.post('/verifypayment', protect, verifyRazorpayPayment);

// Verify Razorpay payment
router.post('/verifypayments', protect, verifyPayment);

// Update order to paid manually
router.put('/:id/pay', protect, updateOrderToPaid);

router.route('/mine')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

router.route('/:id/updatePayment')
  .put(protect, updateOrderPayment);

router.route('/:id/updateDelivery')
  .put(protect, admin, updateOrderDelivery);

router.route('/:id/updateLocation')
  .put(protect, admin, updateOrderLocation);

router.route('/:id/addStep')
  .put(protect, admin, addDeliveryStep);

router.route('/:id/steps')
  .get(protect, getDeliverySteps);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
