// src/pages/CartPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout-flow.css';
import api from '../api';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="checkout-page">
      <h2>🛒 Your Cart</h2>
      <div className="checkout-steps">
        <span className="active">Cart</span> → <span>Checkout</span> → <span>Shipping</span> → <span>Payment</span> → <span>Confirmation</span>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={`/images/${item.images[0]}`}
                  alt={item.name}
                  onError={(e) => e.target.src = '/images/default.jpg'}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>Price: ${item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item._id)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-actions">
            <button onClick={clearCart}>Clear Cart</button>
            <button className="primary" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
