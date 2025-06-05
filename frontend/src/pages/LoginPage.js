// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import '../styles/login.css';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();         // <-- make sure to call this

  // helper to decode and store role
  const storeRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('role', payload.role || 'customer');
    } catch {
      localStorage.setItem('role', 'customer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using centralized API configuration
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      storeRoleFromToken(token);

      navigate('/');            // <-- redirect to home
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // decode credential to get user info
      const googleUser = jwtDecode(credentialResponse.credential);

      // Using centralized API configuration
      const res2 = await api.post('/auth/google-login', {
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      });
      const token2 = res2.data.token;
      localStorage.setItem('token', token2);

      storeRoleFromToken(token2);

      navigate('/');            // <-- redirect to home
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <div className="google-login">
        <p>OR</p>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError('Google Sign-In Failed')}
        />
      </div>
    </div>
  );
};

export default LoginPage;
