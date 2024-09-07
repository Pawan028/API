import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-5 md:px-0">
      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div className="p-6 bg-white shadow-2xl rounded-3xl transform hover:scale-105 transition duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              Update
            </button>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>

        {/* Orders Section */}
        <div className="md:col-span-2 p-6 bg-white shadow-2xl rounded-3xl transform hover:scale-105 transition duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <table className="min-w-full bg-white shadow-lg rounded-2xl overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800">ID</th>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800">DATE</th>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800">TOTAL</th>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800">PAID</th>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800">DELIVERED</th>
                  <th className="py-3 px-5 text-left text-sm font-semibold text-gray-800"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-5">{order._id}</td>
                    <td className="py-3 px-5">{order.createdAt.substring(0, 10)}</td>
                    <td className="py-3 px-5">₹{order.totalPrice}</td>
                    <td className="py-3 px-5">
                      {order.isPaid ? (
                        <span className="text-green-500 font-semibold">
                          {order.paidAt.substring(0, 10)}
                        </span>
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {order.isDelivered ? (
                        <span className="text-green-500 font-semibold">
                          {order.deliveredAt.substring(0, 10)}
                        </span>
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <Link to={`/order/${order._id}`} className="text-indigo-600 hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
