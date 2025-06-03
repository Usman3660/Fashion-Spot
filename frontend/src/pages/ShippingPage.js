// src/pages/ShippingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout-flow.css';
import api from '../api';

const ShippingPage = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cartData = JSON.parse(localStorage.getItem('cart'));
      const totalAmount = cartData.reduce((total, item) => total + item.price * item.quantity, 0);

      const orderDetails = {
        userId: '12345', // placeholder
        cart: cartData,
        totalAmount,
        shippingDetails,
      };

      const response = await api.post('/orders', orderDetails);


      if (response.ok) {
        navigate('/payment');
      } else {
        alert('Failed to submit shipping details');
      }
    } catch (error) {
      console.error('Shipping submission error:', error);
      alert('Error submitting shipping details');
    }
  };

  return (
    <div className="shipping-page">
      <h2>🚚 Shipping Information</h2>
      <div className="checkout-steps">
        <span>Cart</span> → <span>Checkout</span> → <span className="active">Shipping</span> → <span>Payment</span> → <span>Confirmation</span>
      </div>

      <form className="shipping-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={shippingDetails.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={shippingDetails.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={shippingDetails.city} onChange={handleChange} required />
        <input name="postalCode" placeholder="Postal Code" value={shippingDetails.postalCode} onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" value={shippingDetails.phone} onChange={handleChange} required />
        <button className="primary" type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default ShippingPage;
