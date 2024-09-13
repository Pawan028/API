const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_SECRET_KEY',
});

async function createOrder(amount) {
  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise for INR)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1, // Automatically capture payment
  };

  const order = await razorpayInstance.orders.create(options);
  return { orderId: order.id, amount: order.amount, currency: order.currency };
}

function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto.createHmac('sha256', 'YOUR_RAZORPAY_SECRET_KEY')
                                  .update(body.toString())
                                  .digest('hex');
  return expectedSignature === razorpaySignature;
}

module.exports = {
  createOrder,
  verifyPaymentSignature,
};
