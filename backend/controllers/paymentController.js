const Razorpay = require('razorpay');
const Payment = require('../models/paymentModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: receipt,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  try {
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Payment is verified
      // Save payment details to the database
      const payment = new Payment({
        order: orderId,
        paymentMethod: 'Razorpay',
        amountPaid: req.body.amount,
        paymentStatus: 'Completed',
        transactionId: paymentId,
      });

      await payment.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
