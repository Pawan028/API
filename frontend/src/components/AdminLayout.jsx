 // src/components/AdminLayout.js
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-green-800 text-white w-64 p-4">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <ul>
          <li className="mb-4"><Link to="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
          <li className="mb-4"><Link to="/admin/userlist" className="hover:text-gray-400">User List</Link></li>
          <li className="mb-4"><Link to="/admin/productlist" className="hover:text-gray-400">Product List</Link></li>
          <li className="mb-4"><Link to="/admin/orderlist" className="hover:text-gray-400">Order List</Link></li>
          <li className="mb-4"><Link to="/admin/locations" className="hover:text-gray-400">Locations</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {children} {/* This ensures that the child components are rendered */}
      </div>
    </div>
  );
};

export default AdminLayout;
