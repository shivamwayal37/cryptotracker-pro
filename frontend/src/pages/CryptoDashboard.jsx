import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Plus, Bell, BellOff, Eye, EyeOff, User, LogOut, Settings } from 'lucide-react';

const CryptoDashboard = () => {
  const [user, setUser] = useState({ name: 'Riya Kumar', email: 'riya@example.com' });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [watchlist, setWatchlist] = useState(['BTC', 'ETH', 'ADA', 'DOT']);
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'BTC', threshold: 45000, condition: 'above', active: true },
    { id: 2, symbol: 'ETH', threshold: 2800, condition: 'below', active: false }
  ]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertCondition, setAlertCondition] = useState('above');

  // Simulated real-time price data
  const [priceData, setPriceData] = useState({
    BTC: { price: 43250.67, change: 2.34, changePercent: 5.73, volume: '24.5B' },
    ETH: { price: 2856.23, change: -15.67, changePercent: -0.55, volume: '12.8B' },
    ADA: { price: 0.478, change: 0.023, changePercent: 5.05, volume: '890M' },
    DOT: { price: 7.23, change: -0.14, changePercent: -1.90, volume: '445M' }
  });

  // Historical chart data simulation
  const [chartData, setChartData] = useState([]);
  const intervalRef = useRef();

  // Generate initial chart data
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const basePrice = priceData[selectedSymbol]?.price || 40000;
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const variance = (Math.random() - 0.5) * 0.05;
        const price = basePrice * (1 + variance);
        
        data.push({
          time: timestamp.getHours() + ':00',
          price: parseFloat(price.toFixed(2)),
          timestamp: timestamp.getTime()
        });
      }
      
      return data;
    };

    setChartData(generateInitialData());
  }, [selectedSymbol]);

  // Simulate real-time price updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPriceData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const variance = (Math.random() - 0.5) * 0.02;
          const newPrice = updated[symbol].price * (1 + variance);
          const change = newPrice - updated[symbol].price;
          const changePercent = (change / updated[symbol].price) * 100;
          
          updated[symbol] = {
            ...updated[symbol],
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          };
        });
        return updated;
      });

      // Update chart with new data point
      setChartData(prev => {
        const newData = [...prev];
        const now = new Date();
        const currentPrice = priceData[selectedSymbol]?.price || 40000;
        
        newData.push({
          time: now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0'),
          price: currentPrice,
          timestamp: now.getTime()
        });

        // Keep only last 24 data points
        return newData.slice(-24);
      });
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [selectedSymbol]);

  const addToWatchlist = () => {
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, newSymbol.toUpperCase()]);
      setPriceData(prev => ({
        ...prev,
        [newSymbol.toUpperCase()]: {
          price: Math.random() * 1000 + 100,
          change: (Math.random() - 0.5) * 50,
          changePercent: (Math.random() - 0.5) * 10,
          volume: Math.random() * 10 + 'B'
        }
      }));
      setNewSymbol('');
      setShowAddModal(false);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const addAlert = () => {
    if (alertThreshold && selectedSymbol) {
      const newAlert = {
        id: Date.now(),
        symbol: selectedSymbol,
        threshold: parseFloat(alertThreshold),
        condition: alertCondition,
        active: true
      };
      setAlerts([...alerts, newAlert]);
      setAlertThreshold('');
    }
  };

  const toggleAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    ));
  };

  const formatPrice = (price) => {
    if (price >= 1) return `$${price.toLocaleString()}`;
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change, percent) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to Dashboard</h2>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          <p className="text-gray-400 text-center mt-4 text-sm">
            Demo credentials: any email/password
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">CryptoTracker Pro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <button 
              onClick={() => setCurrentView('settings')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{user.name}</span>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('alerts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'alerts' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Alerts ({alerts.filter(a => a.active).length})
          </button>
        </div>

        {currentView === 'dashboard' && (
          <>
            {/* Watchlist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {watchlist.map(symbol => {
                const data = priceData[symbol];
                if (!data) return null;

                return (
                  <div
                    key={symbol}
                    className={`bg-gray-800 p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedSymbol === symbol ? 'border-blue-500 bg-gray-750' : 'border-gray-700'
                    }`}
                    onClick={() => setSelectedSymbol(symbol)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{symbol}</h3>
                        <p className="text-gray-400 text-sm">Volume: {data.volume}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(symbol);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{formatPrice(data.price)}</div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        data.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{formatChange(data.change, data.changePercent)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add New Symbol Card */}
              <div
                className="bg-gray-800 p-6 rounded-xl border-2 border-dashed border-gray-600 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center"
                onClick={() => setShowAddModal(true)}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-gray-400">Add Symbol</span>
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-gray-800 p-6 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedSymbol} Price Chart</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">24H</button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600">7D</button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600">30D</button>
                </div>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`${value.toLocaleString()}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Alert Setup */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Quick Alert Setup</h3>
              <div className="flex space-x-4">
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {watchlist.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
                <input
                  type="number"
                  placeholder="Price threshold"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={addAlert}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add Alert
                </button>
              </div>
            </div>
          </>
        )}

        {currentView === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Price Alerts</h2>
            
            {alerts.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-xl text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No alerts configured yet</p>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Set Up Your First Alert
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-gray-800 p-6 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${alert.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <div>
                        <div className="font-semibold">
                          {alert.symbol} {alert.condition} ${alert.threshold.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          Current price: {formatPrice(priceData[alert.symbol]?.price || 0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          alert.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {alert.active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                        className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Symbol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Symbol</h3>
            <input
              type="text"
              placeholder="Enter symbol (e.g., SOL, AVAX)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
              onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            />
            <div className="flex space-x-3">
              <button
                onClick={addToWatchlist}
                className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors"
              >
                Add to Watchlist
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Update Indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live updates every 3s</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;
