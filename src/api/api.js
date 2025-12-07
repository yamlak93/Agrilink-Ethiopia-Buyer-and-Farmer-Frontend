import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const responseData = error.response.data;
      if (responseData && responseData.message) {
        console.error('Authentication error:', responseData.message);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login on 401
        return new Promise(() => {}); // Prevent further promise resolution
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;