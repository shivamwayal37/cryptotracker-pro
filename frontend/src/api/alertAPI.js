import axiosInstance from './axiosConfig';

export const alertAPI = {
  getUserAlerts: async () => {
    const response = await axiosInstance.get('/alerts');
    return response.data;
  },

  getUserActiveAlerts: async () => {
    const response = await axiosInstance.get('/alerts/active');
    return response.data;
  },

  createAlert: async (symbol, thresholdPrice, condition) => {
    const response = await axiosInstance.post('/alerts', {
      symbol,
      thresholdPrice,
      condition
    });
    return response.data;
  },

  deleteAlert: async (alertId) => {
    const response = await axiosInstance.delete(`/alerts/${alertId}`);
    return response.data;
  },

  deactivateAlert: async (alertId) => {
    const response = await axiosInstance.put(`/alerts/${alertId}/deactivate`);
    return response.data;
  }
};
