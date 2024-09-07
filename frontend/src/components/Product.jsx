import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div className='border border-gray-200 rounded-lg shadow-md p-4 my-4'>
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className='w-full h-64 object-cover rounded-t-lg' 
        />
      </Link>

      <div className='p-4'>
        <Link to={`/product/${product._id}`}>
          <h5 className='text-lg font-semibold mb-2'>{product.name}</h5>
        </Link>

        <div className='mb-2'>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>

        <h3 className='text-xl font-bold text-gray-900'>
          ₹{product.price}
        </h3>
      </div>
    </div>
  );
};

export default Product;
