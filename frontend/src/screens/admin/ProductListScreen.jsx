import React, { useState } from 'react'; // Import React and useState
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import _ from 'lodash';
import "../../assets/styles/ProductListScreen.css";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = data?.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered products by category
  const groupedProducts = _.groupBy(filteredProducts || [], 'category');

  return (
    <div className='product-container'>
      <Row className='align-items-center'>
        <Col>
          <h1 className='product-title'>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Form className='search-form'>
        <Form.Control
          type='text'
          placeholder='Search products by name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {Object.keys(groupedProducts).map((category) => (
  <React.Fragment key={category}>
    <tr className='category-row'>
      <td colSpan='6'>{category}</td>
    </tr>
    {groupedProducts[category].map((product) => (
      <tr key={product._id}>
        <td>{product._id}</td>
        <td>{product.name}</td>
        <td>₹{product.price}</td>
        <td>{product.category}</td>
        <td>{product.brand}</td>
        <td>
          <Button
            as={Link}
            to={`/admin/product/${product._id}/edit`}
            variant='light'
            className='btn-sm mx-2'
          >
            <FaEdit />
          </Button>
          <Button
            variant='danger'
            className='btn-sm'
            onClick={() => deleteHandler(product._id)}
          >
            <FaTrash />
          </Button>
        </td>
      </tr>
    ))}
  </React.Fragment>
))}

            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
