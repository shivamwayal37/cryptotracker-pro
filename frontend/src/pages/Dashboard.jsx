import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { watchlistAPI } from '../api/watchlistAPI';
import { priceAPI } from '../api/priceAPI';
import { alertAPI } from '../api/alertAPI';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import PriceChart from '../components/charts/PriceChart';
import AlertNotification from '../components/alerts/AlertNotification';
import AddSymbolModal from '../components/watchlist/AddSymbolModal';
import AlertForm from '../components/alerts/AlertForm';
import { SYMBOL_TYPES } from '../utils/constants';
import { 
  TrendingUp, 
  Plus, 
  Bell, 
  Activity, 
  BarChart3, 
  Sparkles,
  Wallet,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { priceData, alerts, subscribeToPrice, subscribeToUserAlerts, clearAlerts } = useWebSocket();
  
  const [watchlist, setWatchlist] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchlist();
      subscribeToUserAlerts(user.username, (alert) => {
        console.log('New alert:', alert);
      });
    }
  }, [user]);

  useEffect(() => {
    // Subscribe to price updates for all symbols in watchlist
    watchlist.forEach(item => {
      subscribeToPrice(item.symbol, (data) => {
        console.log(`Price update for ${item.symbol}:`, data);
      });
    });
  }, [watchlist]);

  const loadWatchlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await watchlistAPI.getUserWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      if (error.response?.status === 401) {
        console.log('Session expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (symbol, symbolType) => {
    try {
      await watchlistAPI.addToWatchlist(symbol, symbolType);
      await loadWatchlist();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      await watchlistAPI.removeFromWatchlist(symbol);
      await loadWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleCreateAlert = async (symbol, thresholdPrice, condition) => {
    try {
      await alertAPI.createAlert(symbol, thresholdPrice, condition);
      setShowAlertForm(false);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const dismissAlert = (index) => {
    const newAlerts = alerts.filter((_, i) => i !== index);
    clearAlerts();
  };

  // Calculate portfolio stats
  const portfolioStats = {
    totalValue: watchlist.length * 5420.32,
    dayChange: 2.34,
    activeAlerts: alerts.filter(a => a.active).length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Access Restricted</h2>
          <p className="text-slate-400 max-w-md">
            Please log in to access your personalized dashboard and start tracking your investments.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50">
              <Activity className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-slate-300 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Syncing real-time data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-slate-900/60 border-b border-slate-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CryptoTracker Pro
                </h1>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Live Market Data</span>
                </p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Active Alerts Badge */}
              {portfolioStats.activeAlerts > 0 && (
                <div className="relative group cursor-pointer">
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-red-500/50 animate-bounce">
                    {portfolioStats.activeAlerts}
                  </div>
                  <div className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all transform hover:scale-110">
                    <Bell className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              )}

              {/* User Profile */}
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{user?.username}</p>
                  <p className="text-xs text-slate-400">Premium User</p>
                </div>
              </div>

              {/* Add Symbol Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="relative group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Symbol</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Notifications */}
      {alerts.length > 0 && (
        <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
          {alerts.map((alert, index) => (
            <AlertNotification
              key={index}
              alert={alert}
              onDismiss={() => dismissAlert(index)}
            />
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <div className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <Sparkles className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Portfolio</p>
              <p className="text-3xl font-bold text-white mb-1">
                ${portfolioStats.totalValue.toLocaleString()}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${portfolioStats.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {portfolioStats.dayChange >= 0 ? '+' : ''}{portfolioStats.dayChange}%
                </span>
                <span className="text-xs text-slate-500">Today</span>
              </div>
            </div>
          </div>

          {/* Active Symbols */}
          <div className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Symbols</p>
              <p className="text-3xl font-bold text-white mb-1">{watchlist.length}</p>
              <p className="text-xs text-slate-500">In your watchlist</p>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 hover:border-pink-500/50 transition-all p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <Bell className="w-6 h-6 text-pink-400" />
                </div>
                <Activity className="w-5 h-5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Alerts</p>
              <p className="text-3xl font-bold text-white mb-1">{portfolioStats.activeAlerts}</p>
              <p className="text-xs text-slate-500">Monitoring prices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Your Watchlist</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all flex items-center space-x-2 border border-slate-600/50 hover:border-slate-500/50"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Symbol</span>
                </button>
              </div>
              
              {watchlist.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 mb-6 text-lg">No symbols in your watchlist yet</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add your first symbol</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchlist.map((item) => (
                    <WatchlistCard
                      key={item.id}
                      item={item}
                      priceData={priceData[item.symbol]}
                      onRemove={() => handleRemoveFromWatchlist(item.symbol)}
                      onSelect={() => setSelectedSymbol(item.symbol)}
                      onCreateAlert={() => setShowAlertForm(true)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Chart */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-2xl p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Live Chart</h2>
              </div>
              
              {selectedSymbol ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <p className="text-sm text-slate-400 mb-1">Selected Symbol</p>
                    <p className="text-2xl font-bold text-white">{selectedSymbol}</p>
                  </div>
                  <PriceChart symbol={selectedSymbol} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Select a symbol from your<br />watchlist to view the chart
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddSymbolModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddToWatchlist}
        />
      )}

      {showAlertForm && (
        <AlertForm
          symbol={selectedSymbol}
          onClose={() => setShowAlertForm(false)}
          onSubmit={handleCreateAlert}
        />
      )}
    </div>
  );
};

export default Dashboard;