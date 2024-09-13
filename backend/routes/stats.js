const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Location = require('../models/locationModel');

 // Get expanded statistics
router.get('/', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const locationsCount = await Location.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    const recentOrders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).sort({ createdAt: -1 }).limit(10);

    const mostOrderedProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.productId", ordersCount: { $sum: 1 } } },
      { $sort: { ordersCount: -1 } },
      { $limit: 10 },
    ]);

    const productIds = mostOrderedProducts.map((p) => p._id);
    const products = await Product.find({ _id: { $in: productIds } });
    const mostOrderedProductsWithDetails = mostOrderedProducts.map((p) => ({
      ...products.find((prod) => prod._id.toString() === p._id.toString()),
      ordersCount: p.ordersCount,
    }));

    // Get top locations by order count
    const topLocations = await Order.aggregate([
      { $group: { _id: "$location", ordersCount: { $sum: 1 } } },
      { $sort: { ordersCount: -1 } },
      { $limit: 5 },
    ]);

    // Revenue trend for the past 7 days
    const revenueTrend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const paymentMethods = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    const paymentMethodsCount = paymentMethods.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { cod: 0, online: 0 });

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      locations: locationsCount,
      totalRevenue: totalRevenueAmount,
      recentOrders,
      mostOrderedProducts: mostOrderedProductsWithDetails,
      topLocations,
      revenueTrend,
      paymentMethods: paymentMethodsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
