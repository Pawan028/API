import React from 'react';
import { FaUsers, FaBoxOpen, FaClipboardList, FaMapMarkedAlt } from 'react-icons/fa';
import { useNavigate, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage your application efficiently with the options below.</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          onClick={() => navigate('userlist')}
        >
          <FaUsers className="text-4xl text-blue-500 mx-auto" />
          <h3 className="text-xl font-semibold text-center mt-4">Users</h3>
          <p className="text-center text-gray-600">Manage all users</p>
        </div>

        <div 
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          onClick={() => navigate('productlist')}
        >
          <FaBoxOpen className="text-4xl text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-center mt-4">Products</h3>
          <p className="text-center text-gray-600">Manage products</p>
        </div>

        <div 
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          onClick={() => navigate('orderlist')}
        >
          <FaClipboardList className="text-4xl text-yellow-500 mx-auto" />
          <h3 className="text-xl font-semibold text-center mt-4">Orders</h3>
          <p className="text-center text-gray-600">Manage orders</p>
        </div>

        <div 
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          onClick={() => navigate('locations')}
        >
          <FaMapMarkedAlt className="text-4xl text-red-500 mx-auto" />
          <h3 className="text-xl font-semibold text-center mt-4">Locations</h3>
          <p className="text-center text-gray-600">Manage store locations</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
        {/* This will render the nested route content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
