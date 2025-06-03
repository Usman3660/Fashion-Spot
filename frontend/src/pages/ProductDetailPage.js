// frontend/src/pages/ProductDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [addedMessage, setAddedMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use direct axios call to auth-service instead of going through the gateway
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedMessage('✅ Added to cart!');

    // Clear message after 2 seconds
    setTimeout(() => setAddedMessage(''), 2000);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img
        src={`/images/${product.images[0]}`}
        alt={product.name}
        onError={(e) => (e.target.src = '/images/default.jpg')}
      />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock} available</p>

      <button onClick={handleAddToCart}>Add to Cart</button>
      {addedMessage && <p style={{ color: 'green', marginTop: '10px' }}>{addedMessage}</p>}
    </div>
  );
};

export default ProductDetailPage;
