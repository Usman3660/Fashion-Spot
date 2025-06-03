// frontend/src/pages/OrderConfirmationPage.js

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/order-confirmation.css';

const OrderConfirmationPage = () => {
  const { cart, clearCart } = useCart();
  const [cartItems, setCartItems] = useState(cart);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) setCartItems(savedCart);
  }, []);

  const calculateTotal = () => {
    if (cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleBackToShopping = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="order-confirmation-page">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order! Your order has been confirmed.</p>

      <h3>Your Order</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={`/images/${item.images[0]}`}
                alt={item.name}
                width="100"
                onError={(e) => (e.target.src = '/images/default.jpg')}
              />
              <div>
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <h4>Total: ${calculateTotal()}</h4>
      </div>

      <button onClick={handleBackToShopping}>Back to Shopping</button>
    </div>
  );
};

export default OrderConfirmationPage;
