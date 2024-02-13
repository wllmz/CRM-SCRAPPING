import axios from 'axios';
import AuthService from './AuthService'; 

const axiosApiInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

axiosApiInstance.interceptors.request.use(
  config => {
    const currentUser = AuthService.getCurrentUser();
    const token = currentUser?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosApiInstance;