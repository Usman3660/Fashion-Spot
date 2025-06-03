// frontend/src/pages/ProductUploadPage.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/product-upload.css';
import api from '../api';

const ProductUploadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    category: '',
    stock: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filenames = files.map(file => file.name); // store filenames only
    setFormData((prev) => ({
      ...prev,
      images: filenames,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const res = await api.post('/products', payload);
      setMessage(res.data.message || 'Product uploaded successfully!');
      setError('');
      setFormData({
        name: '',
        description: '',
        price: '',
        images: [],
        category: '',
        stock: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setMessage('');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload New Product</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
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
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
};

export default ProductUploadPage;
