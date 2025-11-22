export const formatPrice = (price, currency = 'USD') => {
  if (!price) return 'N/A';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });
  
  return formatter.format(price);
};

export const formatPercentage = (percentage) => {
  if (!percentage) return '0.00%';
  
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

export const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  
  if (volume >= 1e12) {
    return `$${(volume / 1e12).toFixed(2)}T`;
  } else if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  } else {
    return formatPrice(volume);
  }
};

export const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A';
  
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return formatPrice(marketCap);
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const getPriceChangeColor = (change) => {
  if (!change) return 'text-gray-500';
  return change >= 0 ? 'text-success-600' : 'text-danger-600';
};

export const getPriceChangeIcon = (change) => {
  if (!change) return '→';
  return change >= 0 ? '↗' : '↘';
};
