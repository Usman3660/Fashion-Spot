// frontend/src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL || 'https://fashion-spot-nu.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
