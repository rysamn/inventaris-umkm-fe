import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default {
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
  }
};