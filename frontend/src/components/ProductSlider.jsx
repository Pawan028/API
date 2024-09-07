import React, { useState} from 'react';
import '../assets/styles/ProductSlider.css'; // Make sure to create this CSS file

const ProductSlider = ({ products }) => {
  const [currentProducts, setCurrentProducts] = useState(products);

  // Handle next button click
  const handleNext = () => {
    setCurrentProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.push(updatedProducts.shift()); // Move first item to the end
      return updatedProducts;
    });
  };

  // Handle previous button click
  const handlePrev = () => {
    setCurrentProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.unshift(updatedProducts.pop()); // Move last item to the start
      return updatedProducts;
    });
  };

  return (
    <div className="slider-container">
      <div className="slide">
        {currentProducts.slice(0, 5).map((product, index) => (
          <div
            key={index}
            className={`item item-${index}`}
            style={{ backgroundImage: `url(${product.image})` }}
          >
            <div className="content">
              <div className="name">{product.name}</div>
              <div className="des">{product.description}</div>
              <button>See More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="button">
        <button className="prev" onClick={handlePrev}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="next" onClick={handleNext}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
