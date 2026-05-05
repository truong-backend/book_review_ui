import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, // 8 giây timeout — nếu BE không chạy sẽ fail nhanh
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // BE không chạy (network error / timeout) → redirect 503
    if (!err.response || err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
      window.location.href = '/503';
    }

    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  search: (params) => api.get('/books/search', { params }),
  getById: (id) => api.get(`/books/${id}`),
  getGenres: () => api.get('/books/genres'),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const reviewsAPI = {
  getByBook: (bookId, params) => api.get(`/books/${bookId}/reviews`, { params }),
  getByUser: (userId, params) => api.get(`/users/${userId}/reviews`, { params }),
  create: (bookId, data) => api.post(`/books/${bookId}/reviews`, data),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  like: (reviewId) => api.post(`/reviews/${reviewId}/like`),
};

export const usersAPI = {
  getMe: () => api.get('/users/me'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/me', data),
};

export default api;