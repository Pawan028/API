import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice'; // Adjust path as needed
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const Shop = () => {
  const { pageNumber = 1, keyword = '' } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    }
  }, [data]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/shop/page/${pageNumber}?category=${category}`);
    refetch();
  };

  return (
    <>
      <Meta title="Shop | EcoMart" />

      <div className="relative z-10 w-full h-full">
        {/* Hero Section with Image */}
        <div className="hero-section py-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-extrabold mb-4 text-center">Welcome to Our Shop</h1>
            {!keyword && (
              <div className="text-center mt-4">
                <p className="text-lg">Browse our collection of products and find the best deals!</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Icons Section */}
        <div className="category-section mb-6 px-4 py-6 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Shop by Category</h2>
            <div className="category-list flex overflow-x-auto gap-4 pb-4">
              <div
                className="category-item cursor-pointer flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 ease-in-out duration-300"
                onClick={() => handleCategorySelect('')}
              >
                <i className="fas fa-th-large text-3xl mb-2"></i>
                <span className="text-lg font-medium">All Categories</span>
              </div>
              {categories.map((category) => (
                <div
                  key={category}
                  className="category-item cursor-pointer flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 ease-in-out duration-300"
                  onClick={() => handleCategorySelect(category)}
                >
                  <i className={`icon-${category.toLowerCase()} text-3xl mb-2`}></i>
                  <span className="text-lg font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section mb-6 px-4 py-6">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Products</h3>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <div key={product._id} className="product-card bg-white border rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {data && (
          <div className="container mx-auto px-4">
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
