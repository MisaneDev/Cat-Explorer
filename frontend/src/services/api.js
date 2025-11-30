import axios from 'axios';

const api = axios.create({
  // DEVE ser HTTPS para se comunicar com o Back-end
  baseURL: 'https://localhost:3000/api', 
  timeout: 5000, 
});

// Interceptador para adicionar o token JWT automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;