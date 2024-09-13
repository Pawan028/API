import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';

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
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 p-4 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105">
          <h2 className="text-xl font-bold mb-6 text-center">User Profile</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform transition-transform hover:scale-105"
            >
              Update
            </button>
            {loadingUpdateProfile && <div className="loader"></div>}
          </form>
        </div>

        <div className="w-full md:w-2/3 p-4 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105">
          <h2 className="text-xl font-bold mb-6 text-center">My Orders</h2>
          {isLoading ? (
            <div className="loader"></div>
          ) : error ? (
            <div className="text-red-500 text-center">{error?.data?.message || error.error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-gray-100 rounded-lg">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Paid</th>
                    <th className="px-4 py-2 text-left">Delivered</th>
                    <th className="px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
  {orders.map((order) => (
    <tr key={order._id} className="hover:bg-gray-200 transform transition-transform hover:scale-105">
      <td className="border px-4 py-2">{order._id}</td>
      <td className="border px-4 py-2">{order.createdAt?.substring(0, 10)}</td>
      <td className="border px-4 py-2">₹{order.totalPrice}</td>
      <td className="border px-4 py-2">
        {order.isPaid ? order.paidAt?.substring(0, 10) : <FaTimes className="text-red-500" />}
      </td>
      <td className="border px-4 py-2">
        {order.isDelivered ? order.deliveredAt?.substring(0, 10) : <FaTimes className="text-red-500" />}
      </td>
      <td className="border px-4 py-2">
        <Link to={`/order/${order._id}`} className="text-blue-500 hover:underline">
          Details
        </Link>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
