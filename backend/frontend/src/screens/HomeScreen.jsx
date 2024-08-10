import { useState, useEffect } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import '../assets/styles/HomeScreen.css';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, error,refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: selectedCategory,
  });

  // Extract categories from the products data
  useEffect(() => {
    if (data && data.products) {
      const uniqueCategories = Array.from(new Set(data.products.map(product => product.category)));
      setCategories(uniqueCategories);
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

  return (
    <>
      {!keyword ? (
        <ProductCarousel className="product-carousel" />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      <Dropdown className="category-dropdown mb-4">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedCategory || 'Select Category'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleCategorySelect('')}>All Categories</Dropdown.Item>
          {categories.map((category, index) => (
            <Dropdown.Item key={index} onClick={() => handleCategorySelect(category)}>
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div className="category-list mb-4">
        <div className="category-item" onClick={() => handleCategorySelect('')}>All Categories</div>
        {categories.map((category, index) => (
          <div key={index} className="category-item" onClick={() => handleCategorySelect(category)}>
            {category}
          </div>
        ))}
      </div>
      {isLoading ? (
        <Loader className="loader" />
      ) : error ? (
        <Message variant='danger' className="message">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="home-screen">
          <Meta />
          <h1>Farm Fresh Finds</h1>
          <Row>
            {data.products.length ? (
              data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} className="product" />
                </Col>
              ))
            ) : (
              <Message variant='info' className="message">
                No products found in this category.
              </Message>
            )}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
            category={selectedCategory}
            className="paginate"
          />
        </div>
      )}
    </>
  );
};

export default HomeScreen;
