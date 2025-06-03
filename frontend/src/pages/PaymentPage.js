// src/pages/PaymentPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/checkout-flow.css';

//if this code is not working than try the  code in comment 

const PaymentPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Payment submitted:', paymentDetails);
    navigate('/order-confirmation');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="payment-page">
      <h2>💳 Payment</h2>
      <div className="checkout-steps">
        <span>Cart</span> → <span>Checkout</span> → <span>Shipping</span> → <span className="active">Payment</span> → <span>Confirmation</span>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items to proceed.</p>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit}>
          <h3>Order Total: ${calculateTotal()}</h3>

          <input name="cardholderName" placeholder="Cardholder Name" value={paymentDetails.cardholderName} onChange={handleChange} required />
          <input name="cardNumber" placeholder="Card Number" value={paymentDetails.cardNumber} onChange={handleChange} required />
          <input name="expiryDate" placeholder="Expiry Date (MM/YY)" value={paymentDetails.expiryDate} onChange={handleChange} required />
          <input name="cvv" placeholder="CVV" value={paymentDetails.cvv} onChange={handleChange} required />

          <button className="primary" type="submit">Pay Now</button>
        </form>
      )}
    </div>
  );
};

export default PaymentPage;



/* // src/pages/PaymentPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../styles/checkout-flow.css';

const PaymentPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total in cents
  const totalAmount = Math.round(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1) Create PaymentIntent on backend
      const { data } = await axios.post('/payment', {
        amount: totalAmount,
        currency: 'usd',
      });
      const clientSecret = data.clientSecret;

      // 2) Normally you'd now mount Stripe Elements and confirmCardPayment(clientSecret)
      //    but for simplicity, we'll assume payment succeeds immediately

      console.log('Stripe clientSecret:', clientSecret);
      // TODO: call stripe.confirmCardPayment(clientSecret, payment details...)

      // 3) Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Payment error:', err);
      setError(
        err.response?.data?.error || 'Failed to process payment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="payment-page">
        <h2>💳 Payment</h2>
        <p>Your cart is empty. Please add items to proceed.</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h2>💳 Payment</h2>
      <div className="checkout-steps">
        <span>Cart</span> → <span>Checkout</span> →{' '}
        <span>Shipping</span> → <span className="active">Payment</span> →{' '}
        <span>Confirmation</span>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        <h3>Order Total: ${(totalAmount / 100).toFixed(2)}</h3>

        <input
          name="cardholderName"
          placeholder="Cardholder Name"
          value={paymentDetails.cardholderName}
          onChange={handleChange}
          required
        />
        <input
          name="cardNumber"
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChange={handleChange}
          required
        />
        <input
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={paymentDetails.expiryDate}
          onChange={handleChange}
          required
        />
        <input
          name="cvv"
          placeholder="CVV"
          value={paymentDetails.cvv}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="primary" type="submit" disabled={loading}>
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
 */