import axiosInstance from './axiosConfig';

export const authAPI = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await axiosInstance.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
