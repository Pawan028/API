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

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: {
        placed: true,
        confirmed: true,
      },
      timestamps: {
        placed: Date.now(),
        confirmed: Date.now(),
      },
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: createdOrder._id.toString(),
    });

    // Save Razorpay order ID to the order
    createdOrder.paymentDetails = {
      razorpayOrderId: razorpayOrder.id,
    };

    await createdOrder.save();

    res.status(201).json({ order: createdOrder, razorpayOrder });

});


// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Payment is verified
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: paymentId,
          status: 'Paid',
        };

        const updatedOrder = await order.save();

        // Save payment details
        const payment = new Payment({
          order: orderId,
          paymentMethod: 'Razorpay',
          amountPaid: order.totalPrice,
          paymentStatus: 'Completed',
          transactionId: paymentId,
        });

        await payment.save();

        res.json(updatedOrder);
      } else {
        res.status(404);
        throw new Error('Order not found');
      }
    } else {
      res.status(400);
      throw new Error('Invalid signature');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
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

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
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

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, date } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Ensure the status field is an object
    if (order.status && typeof order.status === 'object') {
      // Check if the provided status is a valid key in the order status object
      if (order.status[status] !== undefined) {
        // Update the status field
        order.status[status] = true;
        // Update the timestamp for the status if a date is provided
        order.timestamps[status] = date ? new Date(date) : Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400);
        throw new Error('Invalid status');
      }
    } else {
      res.status(400);
      throw new Error('Order status field is not an object');
    }
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
