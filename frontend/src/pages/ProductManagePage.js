// frontend/src/pages/ProductManagePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/manage-products.css';
import api from '../api';

const ProductManagePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-manage-page">
      <h2>🛠️ Manage Your Products</h2>
      <button className="upload-button" onClick={() => navigate('/upload-product')}>
        + Add New Product
      </button>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={`/images/${product.images[0]}`}
                alt={product.name}
                onError={(e) => (e.target.src = '/images/default.jpg')}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>${product.price}</strong></p>
              <div className="product-actions">
                <Link to={`/edit-product/${product._id}`} className="edit-btn">Edit</Link>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagePage;
