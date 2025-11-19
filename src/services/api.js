import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor untuk menambahkan token JWT ke header
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk menangani error otentikasi
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token tidak valid atau kedaluwarsa
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke halaman login, asumsi path router adalah '/login'
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  produk: {
    getAll: () => api.get('/produk'),
    getById: (id) => api.get(`/produk/${id}`),
    create: (data) => api.post('/produk', data),
    update: (id, data) => api.put(`/produk/${id}`, data),
    delete: (id) => api.delete(`/produk/${id}`)
  },

  pemasok: {
    getAll: () => api.get('/pemasok'),
    getById: (id) => api.get(`/pemasok/${id}`),
    create: (data) => api.post('/pemasok', data),
    update: (id, data) => api.put(`/pemasok/${id}`, data),
    delete: (id) => api.delete(`/pemasok/${id}`)
  },

  pelanggan: {
    getAll: () => api.get('/pelanggan'),
    getById: (id) => api.get(`/pelanggan/${id}`),
    create: (data) => api.post('/pelanggan', data),
    update: (id, data) => api.put(`/pelanggan/${id}`, data),
    delete: (id) => api.delete(`/pelanggan/${id}`)
  },

  transaksi: {
    getAll: () => api.get('/transaksi'),
    getById: (id) => api.get(`/transaksi/${id}`),
    create: (data) => api.post('/transaksi', data)
  }
};