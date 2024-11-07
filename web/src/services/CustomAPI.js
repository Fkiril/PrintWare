import axios from 'axios';
import useAuth from '../hooks/useAuth';

const useCustomAuth = () => {
  const { token } = useAuth();
  return token;
};

const customAPI = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

customAPI.interceptors.request.use(
  config => {
    const api_token = useCustomAuth();
    if (api_token) {
      config.headers.Authorization = `Bearer ${api_token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default customAPI;
