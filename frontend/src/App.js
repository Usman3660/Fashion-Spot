// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Added Footer
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductUploadPage from './pages/ProductUploadPage';
import ProductManagePage from './pages/ProductManagePage';
import EditProductPage from './pages/EditProductPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { CartProvider } from './context/CartContext';

import './App.css';
import './styles/global.css'; // ✅ Optional modern base styling

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductListPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/upload-product" element={<ProductUploadPage />} />
              <Route path="/manage-products" element={<ProductManagePage />} />
              <Route path="/edit-product/:id" element={<EditProductPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Routes>
          </main>

          <Footer /> {/* ✅ Inserted Footer at bottom */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
