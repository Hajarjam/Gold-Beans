import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAccount: () => api.delete('/users/account'),
};

export const coffeeAPI = {
  getAll: () => api.get('/coffees'),
  getPreview: () => api.get('/coffees/preview'),
  getById: (id) => api.get(`/coffees/${id}`),
};

export const subscriptionAPI = {
  getAll: () => api.get('/subscriptions'),
  getPreview: () => api.get('/subscriptions/preview'),
  create: (data) => api.post('/subscriptions', data),
  cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
};

export const deliveryAPI = {
  getAll: () => api.get('/deliveries'),
  getUpcoming: () => api.get('/deliveries/upcoming'),
};