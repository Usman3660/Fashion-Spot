// frontend/src/context/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1) Configure Axios default base URL for all requests
axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load saved cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) setCart(savedCart);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate total
  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  // Add or increment item in cart, then sync with backend
  const addToCart = async (product) => {
    // 1) Update local state
    let updatedCart = [...cart];
    const idx = updatedCart.findIndex((i) => i._id === product._id);

    if (idx >= 0) {
      updatedCart[idx].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // 2) Sync with backend
    try {
      await axios.post('/orders/create', {
        userId: 'userId',             // TODO: replace with real user ID
        cart: updatedCart,
        totalAmount: calculateTotal(),
      });
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
    }
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
