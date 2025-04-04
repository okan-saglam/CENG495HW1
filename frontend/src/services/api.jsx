import axios from 'axios';

// Axios instance yaratma
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 
      'http://localhost:3000/api' : 
      'https://e-commerce-ruby-kappa-47.vercel.app/api'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Global error handler
api.interceptors.response.use(
  response => response,
  error => {
    console.log('API error intercepted:', error);
    return Promise.reject(error);
  }
);

// Recover token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;