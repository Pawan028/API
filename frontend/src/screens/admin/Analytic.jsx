import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaBoxOpen, FaClipboardList, FaMapMarkedAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto'; // If using Chart.js

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    locations: 0,
    totalRevenue: 0,
    recentOrders: [],
    mostOrderedProducts: [],
    paymentMethods: { cod: 0, online: 0 },
    topLocations: [],
  });
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin');
        setData({
          users: response.data.users || 0,
          products: response.data.products || 0,
          orders: response.data.orders || 0,
          locations: response.data.locations || 0,
          totalRevenue: response.data.totalRevenue || 0,
          recentOrders: response.data.recentOrders || [],
          mostOrderedProducts: response.data.mostOrderedProducts || [],
          paymentMethods: response.data.paymentMethods || { cod: 0, online: 0 },
          topLocations: response.data.topLocations || [],
        });

        // Set up charts here (for example, revenue trend)
        setupRevenueChart(response.data.revenueTrend);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleDetailsClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Example setup for a chart (Revenue trend)
  const setupRevenueChart = (revenueTrend) => {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: revenueTrend.map((data) => data.date),
        datasets: [
          {
            label: 'Revenue',
            data: revenueTrend.map((data) => data.revenue),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
          },
        ],
      },
    });
  };

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}>
      {/* Dark Mode Toggle */}
      <div className="p-6 flex justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={toggleDarkMode}
          className="text-2xl p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Users', value: data.users, icon: <FaUsers /> },
          { label: 'Products', value: data.products, icon: <FaBoxOpen /> },
          { label: 'Orders', value: data.orders, icon: <FaClipboardList /> },
          { label: 'Locations', value: data.locations, icon: <FaMapMarkedAlt /> },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center`}
          >
            <div className="text-3xl mb-2 text-blue-600 dark:text-blue-400">{item.icon}</div>
            <h2 className="text-2xl font-bold">{item.value}</h2>
            <p className="text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
        <canvas id="revenueChart"></canvas>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders (Past 24h)</h2>
        <ul className="space-y-4">
          {data.recentOrders.length > 0 ? (
            data.recentOrders.map((order) => (
              <li key={order._id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>Order ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2) || 'N/A'}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDetailsClick(order._id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No recent orders</li>
          )}
        </ul>
      </div>

      {/* Most Ordered Products */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Most Ordered Products</h2>
        <ul className="space-y-4">
          {data.mostOrderedProducts.length > 0 ? (
            data.mostOrderedProducts.map((product) => (
              <li key={product._id} className="border-b pb-4">
                <p>
                  <strong>Product Name:</strong> {product.name || 'N/A'}
                </p>
                <p>
                  <strong>Orders Count:</strong> {product.ordersCount || 0}
                </p>
              </li>
            ))
          ) : (
            <li>No products found</li>
          )}
        </ul>
      </div>

      {/* Top Locations */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Top Locations by Orders</h2>
        <ul className="space-y-4">
          {data.topLocations.length > 0 ? (
            data.topLocations.map((location, index) => (
              <li key={index} className="border-b pb-4">
                <p>
                  <strong>Location:</strong> {location.name || 'N/A'}
                </p>
                <p>
                  <strong>Orders Count:</strong> {location.ordersCount || 0}
                </p>
              </li>
            ))
          ) : (
            <li>No locations found</li>
          )}
        </ul>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>COD:</strong> {data.paymentMethods.cod}
            </p>
          </div>
          <div>
            <p>
              <strong>Online:</strong> {data.paymentMethods.online}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
