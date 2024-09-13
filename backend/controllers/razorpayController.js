const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/orderModel');

// Create an instance of Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount, // amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    res.status(500);
    throw new Error('Error creating Razorpay order');
  }
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Check if the order exists
  const order = await Order.findById(orderId).populate('user');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Generate HMAC and compare signatures
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  // Logging for debugging
  console.log('Received Razorpay Payment Data:', {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  console.log('Generated Signature:', generatedSignature);
  console.log('Provided Signature:', razorpay_signature);

  if (generatedSignature === razorpay_signature) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'Paid',
      update_time: Date.now(),
      email_address: order.user.email,
    };

    order.razorpay = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      verified: true,
    };

    const updatedOrder = await order.save();
    res.status(200).json({ success: true, message: 'Payment verified and order updated', order: updatedOrder });
  } else {
    console.error('Invalid payment signature');
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});


module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
