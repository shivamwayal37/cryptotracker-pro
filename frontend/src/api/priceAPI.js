import axiosInstance from './axiosConfig';

export const priceAPI = {
  getCurrentPrice: async (symbol, symbolType = 'CRYPTO') => {
    const response = await axiosInstance.get(`/prices/${symbol}`, {
      params: { symbolType }
    });
    return response.data;
  },

  getHistoricalPrices: async (symbol, hours = 24) => {
    const response = await axiosInstance.get(`/prices/${symbol}/history`, {
      params: { hours }
    });
    return response.data;
  },

  getBatchPrices: async (symbols, symbolTypes) => {
    const response = await axiosInstance.get('/prices/batch', {
      params: { symbols, symbolTypes }
    });
    return response.data;
  },

  clearCache: async (symbol) => {
    const response = await axiosInstance.delete(`/prices/cache/${symbol}`);
    return response.data;
  },

  clearAllCache: async () => {
    const response = await axiosInstance.delete('/prices/cache');
    return response.data;
  }
};
