const asyncHandler = require('../middleware/asyncHandler'); // Adjust path as necessary
const { createOrder, verifyPaymentSignature } = require('../utils/razorpay');
const Order = require('../models/orderModel');

// @desc    Initiate Razorpay payment
// @route   POST /api/payments/initiate
// @access  Private
const initiatePayment = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const order = await createOrder(amount);
  res.status(200).json(order);
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  const isVerified = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (isVerified) {
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpayPaymentId,
        status: 'Paid',
        update_time: order.paidAt,
      };
      const updatedOrder = await order.save();
      res.status(200).json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = {
  initiatePayment,
  verifyPayment
};
