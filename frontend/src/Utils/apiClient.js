// // apiClient.js
import axios from 'axios';
import { API_BASE_URL } from './apiPath';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.error('Unauthorized access - redirecting to login');
        // Optionally, you can redirect to login page here
         window.location.href = '/login';
      }
      else if (error.response.status === 500) {
        // Handle server errors
        console.error('Server error:', error.response.data);
      }
  }
  else if (error.code === 'ECONNABORTED') {
      // Handle timeout errors
      console.error('Request timed out:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;