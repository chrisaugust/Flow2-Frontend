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
  
  // Don’t attach token for signup/login
  if (token && !["/signup", "/login"].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) { // expired token -> 401 Unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login'; // hard redirect
    }
  }
);

export default api;
