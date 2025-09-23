import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
    headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Don't attach token for signup or login
  if (token && !["/signup", "/login"].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
