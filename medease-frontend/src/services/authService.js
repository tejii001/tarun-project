import api from './api';

const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  refreshToken: async () => {
    return await api.post('/auth/refresh');
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },
};

export default authService;
