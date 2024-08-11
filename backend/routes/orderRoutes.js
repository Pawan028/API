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

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/mine')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);
  
router.route('/:id/verify-payment')
  .post(protect, verifyPayment);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

router.route('/:id/updatePayment')
  .put(protect, admin, updateOrderPayment);

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
