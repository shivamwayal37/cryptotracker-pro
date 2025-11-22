import axiosInstance from './axiosConfig';

export const watchlistAPI = {
  getUserWatchlist: async () => {
    const response = await axiosInstance.get('/watchlist');
    return response.data;
  },

  addToWatchlist: async (symbol, symbolType) => {
    const response = await axiosInstance.post('/watchlist', { symbol, symbolType });
    return response.data;
  },

  removeFromWatchlist: async (symbol) => {
    const response = await axiosInstance.delete(`/watchlist/${symbol}`);
    return response.data;
  },

  getUserSymbols: async () => {
    const response = await axiosInstance.get('/watchlist/symbols');
    return response.data;
  }
};
