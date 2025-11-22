import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { priceAPI } from '../../api/priceAPI';
import { CHART_TIME_PERIODS } from '../../utils/constants';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Clock,
  BarChart3,
  Maximize2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState(24); // Default to 24 hours
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [highLow, setHighLow] = useState({ high: 0, low: 0 });

  useEffect(() => {
    if (symbol) {
      loadChartData();
    }
  }, [symbol, timePeriod]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const data = await priceAPI.getHistoricalPrices(symbol, timePeriod);
      
      if (data && data.length > 0) {
        processChartData(data);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
      createMockChartData();
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const prices = data.map(item => item.price);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    
    setPriceChange({ value: change, percent: changePercent });
    setHighLow({
      high: Math.max(...prices),
      low: Math.min(...prices)
    });

    const isPositive = change >= 0;

    const chartData = {
      labels: data.map(item => new Date(item.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })),
      datasets: [
        {
          label: `${symbol} Price`,
          data: prices,
          borderColor: isPositive ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            if (isPositive) {
              gradient.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
              gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.2)');
              gradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
            } else {
              gradient.addColorStop(0, 'rgba(248, 113, 113, 0.4)');
              gradient.addColorStop(0.5, 'rgba(248, 113, 113, 0.2)');
              gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
            }
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: isPositive ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
          pointHoverBorderColor: '#1e293b',
          pointHoverBorderWidth: 3,
        },
      ],
    };
    setChartData(chartData);
  };

  const createMockChartData = () => {
    const now = new Date();
    const labels = [];
    const data = [];
    
    const basePrice = 50000;
    let currentPrice = basePrice;
    
    for (let i = timePeriod; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      const variation = (Math.random() - 0.5) * 0.05;
      currentPrice = currentPrice * (1 + variation);
      data.push(currentPrice);
    }

    const firstPrice = data[0];
    const lastPrice = data[data.length - 1];
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    const isPositive = change >= 0;
    
    setPriceChange({ value: change, percent: changePercent });
    setHighLow({
      high: Math.max(...data),
      low: Math.min(...data)
    });
    
    setChartData({
      labels,
      datasets: [
        {
          label: `${symbol} Price`,
          data,
          borderColor: isPositive ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            if (isPositive) {
              gradient.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
              gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.2)');
              gradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
            } else {
              gradient.addColorStop(0, 'rgba(248, 113, 113, 0.4)');
              gradient.addColorStop(0.5, 'rgba(248, 113, 113, 0.2)');
              gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
            }
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: isPositive ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
          pointHoverBorderColor: '#1e293b',
          pointHoverBorderWidth: 3,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `$${context.parsed.y.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(71, 85, 105, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkipPadding: 20,
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          display: true,
          color: 'rgba(71, 85, 105, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const isPositiveChange = priceChange.value >= 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-medium">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-3">
        {/* Price Change */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
          <div className="flex items-center space-x-2 mb-2">
            {isPositiveChange ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs text-slate-400 font-medium">Period Change</span>
          </div>
          <div className={`text-xl font-bold ${
            isPositiveChange ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {isPositiveChange ? '+' : ''}{priceChange.percent.toFixed(2)}%
          </div>
          <div className={`text-xs mt-1 ${
            isPositiveChange ? 'text-emerald-400/70' : 'text-red-400/70'
          }`}>
            ${Math.abs(priceChange.value).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </div>

        {/* High/Low */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 font-medium">High / Low</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-bold text-emerald-400">
              ${highLow.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-bold text-red-400">
              ${highLow.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400 font-medium">Time Period</span>
        </div>
        <div className="flex space-x-2">
          {CHART_TIME_PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setTimePeriod(period.value)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all transform hover:scale-105 ${
                timePeriod === period.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Chart Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/30"></div>
        
        {/* Chart */}
        <div className="relative p-4 h-80">
          {chartData ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <BarChart3 className="w-12 h-12 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">No data available</p>
              <p className="text-slate-500 text-sm">Try selecting a different time period</p>
            </div>
          )}
        </div>

        {/* Fullscreen Button */}
        <button className="absolute top-6 right-6 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-600/50 text-slate-400 hover:text-white transition-all transform hover:scale-110">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chart Info Footer */}
      <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-700/20">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time data via WebSocket</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;