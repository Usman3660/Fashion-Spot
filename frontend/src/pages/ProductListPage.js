//frontend/src/pages/ProductListPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import HeroBanner from '../components/HeroBanner';
import '../styles/product-list.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using the centralized API configuration
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.log('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <HeroBanner />
      <h2>Product Listings</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={`/images/${product.images[0]}`}
              alt={product.name}
              onError={(e) => (e.target.src = '/images/default.jpg')} // fallback
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <Link to={`/product/${product._id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
