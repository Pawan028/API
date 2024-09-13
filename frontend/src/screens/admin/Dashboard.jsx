import React from 'react';
import { FaUsers, FaBoxOpen, FaClipboardList, FaMapMarkedAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="py-6 px-6 text-center">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-8 flex-1 overflow-y-auto">
          <ul className="space-y-4">
            <li className="cursor-pointer flex items-center px-6 py-3 hover:bg-gray-700 transition" onClick={() => navigate('dash')}>
              <FaTachometerAlt className="text-xl mr-3" />
              <span>Dashboard</span>
            </li>
            <li className="cursor-pointer flex items-center px-6 py-3 hover:bg-gray-700 transition" onClick={() => navigate('userlist')}>
              <FaUsers className="text-xl mr-3" />
              <span>Users</span>
            </li>
            <li className="cursor-pointer flex items-center px-6 py-3 hover:bg-gray-700 transition" onClick={() => navigate('productlist')}>
              <FaBoxOpen className="text-xl mr-3" />
              <span>Products</span>
            </li>
            <li className="cursor-pointer flex items-center px-6 py-3 hover:bg-gray-700 transition" onClick={() => navigate('orderlist')}>
              <FaClipboardList className="text-xl mr-3" />
              <span>Orders</span>
            </li>
            <li className="cursor-pointer flex items-center px-6 py-3 hover:bg-gray-700 transition" onClick={() => navigate('locations')}>
              <FaMapMarkedAlt className="text-xl mr-3" />
              <span>Locations</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-100 overflow-auto">
        {/* Welcome Section */}
        <div className="py-6 px-8 bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your application efficiently with the options on the left.</p>
        </div>

        {/* Main Content (Outlet will render nested routes here) */}
        <div className="bg-white shadow-md rounded-lg p-6 mx-8 my-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
