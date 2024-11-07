import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const { token } = useAuth();

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3456/web-api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const api_token = token;
    if (api_token) {
      config.headers.Authorization = `Bearer ${api_token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
