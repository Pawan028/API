import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import '../assets/styles/ProductCarousel.css';

const getRandomProducts = (products, count) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const randomProducts = products ? getRandomProducts(products, 5) : [];

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div className='product-carousel'>
      {randomProducts.length > 0 && (
        <div className='carousel-images'>
          <Carousel pause='hover'>
            {randomProducts.map((product) => (
              <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    className='carousel-image'
                  />
                  <Carousel.Caption className='carousel-caption'>
                    <h2>{product.name} (₹{product.price})</h2>
                    <p className='carousel-description'>{product.description}</p>
                    <button className='carousel-button'>See More</button>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      
    </div>
  );
};

export default ProductCarousel;
