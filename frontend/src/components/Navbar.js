// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const role = localStorage.getItem('role'); // 'customer', 'brand', 'admin'
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {token ? (
          <>
            <li><Link to="/cart">Cart</Link></li>

            {role === 'brand' && (
              <>
                <li><Link to="/upload-product">Upload Product</Link></li>
                <li><Link to="/manage-products">Manage Products</Link></li>
              </>
            )}

            {role === 'admin' && (
              <li><Link to="/admin/users">Manage Users</Link></li>
            )}

            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
