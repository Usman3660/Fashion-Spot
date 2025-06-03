// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';
import api from '../api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using direct API call to the auth service
      await axios.post('http://localhost:3001/auth/register', { email, password, role });

      alert('Registration Successful');
    } catch (err) {
      console.error('Register error:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="customer">Customer</option>
          <option value="brand">Brand</option>
          <option value="admin">Admin</option> {/* ✅ Now included */}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
