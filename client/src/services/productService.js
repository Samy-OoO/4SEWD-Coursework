import api from './api';

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  remove: (id) => api.delete(`/products/${id}`),
  adjustStock: (id, payload) => api.post(`/products/${id}/stock-movements`, payload),
  getStockMovements: (id) => api.get(`/products/${id}/stock-movements`),
  getAllStockMovements: () => api.get('/products/stock-movements'),
};

export default productService;
