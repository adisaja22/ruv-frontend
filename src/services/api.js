import axios from 'axios';

// Base URL configuration (from env or fallback)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to automatically attach Sanctum Bearer tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ruv_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration/unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ruv_admin_token');
      localStorage.removeItem('ruv_admin_user');
      // If we are currently in admin pages, redirect to login
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================
  getHomepage: () => api.get('/homepage').then((res) => res.data),
  getFormFields: () => api.get('/form-fields').then((res) => res.data),
  getProducts: (category) => api.get('/products', { params: { category } }).then((res) => res.data),
  getContact: () => api.get('/contact').then((res) => res.data),
  getAbout: () => api.get('/about').then((res) => res.data),
  getPartners: () => api.get('/partners').then((res) => res.data),
  getTestimonials: () => api.get('/testimonials').then((res) => res.data),

  // Authentication
  login: (credentials) => api.post('/login', credentials).then((res) => res.data),
  logout: () => api.post('/logout').then((res) => res.data),
  getMe: () => api.get('/me').then((res) => res.data),

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================
  getDashboardStats: () => api.get('/admin/stats').then((res) => res.data),
  updateHomepage: (data) => api.put('/admin/homepage', data).then((res) => res.data),
  updateFormFields: (data) => api.put('/admin/form-fields', data).then((res) => res.data),
  updateStatistics: (data) => api.put('/admin/statistics', data).then((res) => res.data),
  updateContact: (data) => api.put('/admin/contact', data).then((res) => res.data),
  
  updateAbout: (formData) => api.post('/admin/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data),

  // CRUD Products
  getAdminProducts: () => api.get('/admin/products').then((res) => res.data),
  createProduct: (data) => api.post('/admin/products', data).then((res) => res.data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data).then((res) => res.data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`).then((res) => res.data),

  // CRUD Partners
  getAdminPartners: () => api.get('/admin/partners').then((res) => res.data),
  
  createPartner: (formData) => api.post('/admin/partners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data),
  
  updatePartner: (id, formData) => api.post(`/admin/partners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data),
  
  deletePartner: (id) => api.delete(`/admin/partners/${id}`).then((res) => res.data),
  reorderPartners: (ids) => api.post('/admin/partners/reorder', { ids }).then((res) => res.data),

  // CRUD Testimonials
  getAdminTestimonials: () => api.get('/admin/testimonials').then((res) => res.data),
  
  createTestimonial: (formData) => api.post('/admin/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data),
  
  updateTestimonial: (id, formData) => api.post(`/admin/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data),
  
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`).then((res) => res.data),

  // User management
  getUsers: () => api.get('/admin/users').then((res) => res.data),
  createUser: (data) => api.post('/admin/users', data).then((res) => res.data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }).then((res) => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((res) => res.data),
};

export const getStorageUrl = (path) => {
  if (!path) return '';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const domain = baseUrl.replace('/api', '');
  return `${domain}/storage/${path}`;
};

export default api;
