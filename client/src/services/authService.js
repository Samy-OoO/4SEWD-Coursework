import api from './api';

const authService = {
  login: ({ email, password }) => api.post('/auth/login', { email, password }),
  register: ({ email, password }) => api.post('/auth/register', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export default authService;
