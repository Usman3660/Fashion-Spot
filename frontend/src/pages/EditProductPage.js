// frontend/src/pages/EditProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/edit-product.css';
import api from '../api';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    category: '',
    stock: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setFormData(res.data);
      } catch (err) {
        setError('Error loading product');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filenames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      images: filenames
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
         ...formData,
           price: parseFloat(formData.price),
           stock: parseInt(formData.stock, 10),
         });

      setMessage('Product updated successfully!');
      setError('');
      setTimeout(() => navigate('/manage-products'), 1500);
    } catch (err) {
      setError('Update failed');
      setMessage('');
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-product-form">
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        {/* 👇 Image File Selection */}
        <label>Upload New Images:</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {/* 👇 Image Preview */}
        {formData.images.length > 0 && (
          <div className="image-preview">
            {formData.images.map((img, i) => (
              <img
                key={i}
                src={`/images/${img}`}
                alt={`img-${i}`}
                onError={(e) => (e.target.src = '/images/default.jpg')}
              />
            ))}
          </div>
        )}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;
