// src/pages/CheckoutPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout-flow.css';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="checkout-page">
      <h2>🧾 Review Your Order</h2>
      <div className="checkout-steps">
        <span>Cart</span> → <span className="active">Checkout</span> → <span>Shipping</span> → <span>Payment</span> → <span>Confirmation</span>
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
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-actions">
            <h4>Total: ${calculateTotal()}</h4>
            <div>
              <button onClick={clearCart}>Clear Cart</button>
              <button className="primary" onClick={() => navigate('/shipping')}>
                Proceed to Shipping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
