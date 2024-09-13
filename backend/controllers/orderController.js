const asyncHandler = require('../middleware/asyncHandler'); // Adjust path as necessary
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { calcPrices } = require('../utils/calcPrices');
const Razorpay = require('razorpay');
const crypto = require('crypto');

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      throw new Error(`Product not found for item: ${itemFromClient.name}`);
    }

    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  let razorpayOrder = null;
  if (paymentMethod === 'Online') {
    // Create Razorpay order for online payments
    const options = {
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    };

    razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Failed to create Razorpay order');
    }
  }

  const newOrder = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    razorpayOrderId: razorpayOrder ? razorpayOrder.id : null, // Set only for online payments
    status: {
      placed: true,
      confirmed: true,
      paid: paymentMethod === 'Online',
    },
    timestamps: {
      placed: Date.now(),
      confirmed: Date.now(),
      paid: paymentMethod === 'Online' ? Date.now() : undefined,
    },
  });

  const createdOrder = await newOrder.save();

  res.status(201).json({
    ...createdOrder._doc,
    razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
    amount: razorpayOrder ? razorpayOrder.amount / 100 : totalPrice,
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Fetch order
  const order = await Order.findById(orderId).populate('user');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // HMAC verification
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    // Payment verified
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = 'Online';
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
    res.status(200).json({
      success: true,
      message: 'Payment verified and order updated',
      order: updatedOrder,
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});

// @desc    Automatically verify Razorpay payment and update order
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Find the order by ID
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.isPaid) {
    return res.status(400).json({ message: 'Order is already paid' });
  }

  // Step 1: Verify the payment signature
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  // Step 2: If the signature is valid, mark the order as paid
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentMethod = 'Online';
  order.paymentResult = {
    id: razorpay_payment_id,
    status: 'Paid',
    update_time: Date.now(),
    email_address: order.user.email,
  };

  // Save Razorpay details for future reference
  order.razorpay = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    verified: true,
  };

  // Step 3: Save the updated order
  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

module.exports = {
  updateOrderToPaid,
};

 
  
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

 

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/updateStatus
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, date } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!order.status || typeof order.status !== 'object') {
    res.status(400);
    throw new Error('Order status field is not an object');
  }

  if (order.status[status] === undefined) {
    res.status(400);
    throw new Error('Invalid status');
  }

  // Update status and timestamp
  order.status[status] = true;
  order.timestamps[status] = date ? new Date(date) : Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/updatePayment
// @access  Private/Admin
const updateOrderPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = req.body.isPaid || order.isPaid;
    if (req.body.isPaid) {
      order.paidAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order delivery status
// @route   PUT /api/orders/:id/updateDelivery
// @access  Private/Admin
const updateOrderDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = req.body.isDelivered || order.isDelivered;
    if (req.body.isDelivered) {
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order delivery location
// @route   PUT /api/orders/:id/updateLocation
// @access  Private/Admin
const updateOrderLocation = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.deliveryLocation = req.body.deliveryLocation;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Add delivery step
// @route   PUT /api/orders/:id/addStep
// @access  Private/Admin
const addDeliveryStep = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { location } = req.body;
    const newStep = {
      location,
      date: Date.now(),
    };

    order.deliverySteps.push(newStep);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get delivery steps
// @route   GET /api/orders/:id/steps
// @access  Private
const getDeliverySteps = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.json(order.deliverySteps);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


module.exports = {
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
  updateOrderStatus,
  getDeliverySteps,
};
