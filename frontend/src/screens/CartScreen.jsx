import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems = [] } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Go Back
              </Link>
            </Message>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg transform hover:scale-110 transition-transform duration-200"
                  />
                  <div className="flex-1 px-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-lg font-medium">₹{item.price}</div>
                  <select
                    className="ml-4 p-4.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="ml-4 p-2 bg-red-500 text-white rounded-full transform hover:scale-110 transition-transform duration-200"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4">
            Subtotal (
            {cartItems.reduce((acc, item) => acc + item.qty, 0)})
            items
          </h2>
          <div className="text-lg font-medium mb-4">
            ₹
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </div>
          <button
            className={`w-full py-3 bg-blue-600 text-white rounded-lg transform hover:scale-105 transition-transform duration-200 ${
              cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
