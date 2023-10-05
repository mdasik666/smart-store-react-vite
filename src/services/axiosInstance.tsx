import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', 
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
