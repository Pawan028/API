import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [highRatedProducts, setHighRatedProducts] = useState([]);
  const navigate = useNavigate();
  const carouselRef = useRef();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: selectedCategory,
  });

  useEffect(() => {
    if (data && data.products) {
      const uniqueCategories = Array.from(
        new Set(data.products.map((product) => product.category))
      );
      setCategories(uniqueCategories);

      const sortedProducts = [...data.products].sort((a, b) => b.rating - a.rating);
      setHighRatedProducts(sortedProducts.slice(0, 5));
    }
  }, [data]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/page/${pageNumber || 1}?category=${category}`);
    refetch();
  };

  useEffect(() => {
    if (keyword) {
      setSelectedCategory('');
    }
  }, [keyword]);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Meta title="Welcome to EcoMart | Home" />

      <div className="relative z-10 w-full h-full bg-gray-100">
        {/* Hero Section with Image */}
        <div className="hero-section py-8">
          {!keyword ? (
            <div className="hero-image">
              <ProductCarousel products={highRatedProducts} />
            </div>
          ) : (
            <Link to="/" className="btn btn-light bg-white text-blue-500 py-2 px-4 rounded shadow-md hover:bg-gray-200 transition duration-300">
              Go Back
            </Link>
          )}
        </div>

        {/* Category Icons Section */}
        <div className="category-section mb-6 px-4 py-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Shop by Category</h2>
          <div className="category-list flex overflow-x-auto gap-4 pb-4">
            <div
              className="category-item cursor-pointer flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 ease-in-out duration-300"
              onClick={() => handleCategorySelect('')}
            >
              <i className="fas fa-apple-alt text-3xl mb-2"></i>
              <span className="text-lg font-medium">All Categories</span>
            </div>
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-item cursor-pointer flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 ease-in-out duration-300"
                onClick={() => handleCategorySelect(category)}
              >
                <i className={`icon-${category.toLowerCase()} text-3xl mb-2`}></i>
                <span className="text-lg font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High-Rated Products Section */}
        <div className="high-rated-section mb-6 px-4 py-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Rated Products</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="carousel-wrapper flex items-center">
              <button
                className="carousel-control left bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition duration-300"
                onClick={() => scrollLeft(carouselRef)}
              >
                &lt;
              </button>
              <div className="carousel-container overflow-x-auto whitespace-nowrap px-2" ref={carouselRef}>
                <div className="carousel-track flex">
                  {highRatedProducts.length ? (
                    highRatedProducts.map((product) => (
                      <div key={product._id} className="carousel-card mx-2 bg-white border rounded shadow-md hover:shadow-lg transition duration-300">
                        <Product product={product} className="product" />
                      </div>
                    ))
                  ) : (
                    <Message variant="info">No top-rated products found.</Message>
                  )}
                </div>
              </div>
              <button
                className="carousel-control right bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition duration-300"
                onClick={() => scrollRight(carouselRef)}
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* Products by Category */}
        {categories.map((category) => (
          <div key={category} className="category-products mb-6 px-4 py-6">
            <h4 className="text-xl font-bold mb-4 text-gray-800">{category}</h4>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className="carousel-wrapper flex items-center">
                <button
                  className="carousel-control left bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition duration-300"
                  onClick={() => scrollLeft(carouselRef)}
                >
                  &lt;
                </button>
                <div className="carousel-container overflow-x-auto whitespace-nowrap px-2" ref={carouselRef}>
                  <div className="carousel-track flex">
                    {data.products.filter((product) => product.category === category).map((product) => (
                      <div key={product._id} className="carousel-card mx-2 bg-white border rounded shadow-md hover:shadow-lg transition duration-300">
                        <Product product={product} className="product" />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="carousel-control right bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 transition duration-300"
                  onClick={() => scrollRight(carouselRef)}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        {data && (
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        )}
      </div>
    </>
  );
};

export default HomeScreen;
