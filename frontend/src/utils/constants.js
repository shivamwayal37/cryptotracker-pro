export const SYMBOL_TYPES = {
  CRYPTO: 'CRYPTO',
  STOCK: 'STOCK'
};

export const ALERT_CONDITIONS = {
  ABOVE: 'ABOVE',
  BELOW: 'BELOW'
};

export const COMMON_CRYPTO_SYMBOLS = [
  'BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XLM', 'UNI', 'AAVE',
  'SOL', 'MATIC', 'AVAX', 'ATOM', 'FTM', 'NEAR', 'ALGO', 'VET', 'ICP', 'FIL'
];

export const COMMON_STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
  'JPM', 'JNJ', 'V', 'PG', 'HD', 'DIS', 'PYPL', 'CRM', 'ADBE', 'NKE'
];

export const CHART_TIME_PERIODS = [
  { label: '1H', value: 1 },
  { label: '4H', value: 4 },
  { label: '1D', value: 24 },
  { label: '7D', value: 168 },
  { label: '30D', value: 720 }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  PRICES: {
    CURRENT: '/prices',
    HISTORY: '/prices/history',
    BATCH: '/prices/batch'
  },
  WATCHLIST: {
    LIST: '/watchlist',
    ADD: '/watchlist',
    REMOVE: '/watchlist',
    SYMBOLS: '/watchlist/symbols'
  },
  ALERTS: {
    LIST: '/alerts',
    ACTIVE: '/alerts/active',
    CREATE: '/alerts',
    DELETE: '/alerts',
    DEACTIVATE: '/alerts'
  }
};

export const WEBSOCKET_TOPICS = {
  PRICES: '/topic/prices',
  ALERTS: '/topic/alerts',
  USER_ALERTS: '/user/queue/alerts'
};
