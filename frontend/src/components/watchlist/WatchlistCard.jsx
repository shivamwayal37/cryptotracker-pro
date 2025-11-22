import React, { useState } from 'react';
import { formatPrice, formatPercentage, getPriceChangeColor, getPriceChangeIcon } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Bell,
  X,
  Activity,
  DollarSign,
  BarChart3,
  Clock,
  Sparkles,
  Bitcoin,
  Building2
} from 'lucide-react';

const WatchlistCard = ({ item, priceData, onRemove, onSelect, onCreateAlert }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = false; // This would be managed by parent component

  const isPositiveChange = priceData?.changePercent24h >= 0;
  const isCrypto = item.symbolType === 'CRYPTO';

  return (
    <div
      className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${isSelected
          ? 'border-blue-500 bg-slate-800/60 shadow-xl shadow-blue-500/20'
          : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/50'
        }`}
      onClick={() => onSelect(item.symbol)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isCrypto
          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
          : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
        }`}></div>

      {/* Animated Background Orb */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500 ${isCrypto ? 'bg-blue-500' : 'bg-green-500'
        }`}></div>

      {/* Content */}
      <div className="relative p-5">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-3">
            {/* Symbol Icon */}
            <div className={`p-2.5 rounded-xl transition-all ${isCrypto
                ? 'bg-blue-500/10 group-hover:bg-blue-500/20'
                : 'bg-green-500/10 group-hover:bg-green-500/20'
              }`}>
              {isCrypto ? (
                <Bitcoin className={`w-5 h-5 ${isCrypto ? 'text-blue-400' : 'text-green-400'
                  }`} />
              ) : (
                <Building2 className="w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Symbol Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                {item.symbol}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ${isCrypto
                  ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                  : 'bg-green-500/10 text-green-300 border border-green-500/20'
                }`}>
                {item.symbolType}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex space-x-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateAlert(item.symbol);
              }}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${isCrypto
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300'
                  : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300'
                }`}
              title="Create Alert"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.symbol);
              }}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all transform hover:scale-110 hover:rotate-90"
              title="Remove from Watchlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price Data Section */}
        {priceData ? (
          <div className="space-y-4">
            {/* Main Price Display */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-400 mb-1 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Current Price</span>
                </p>
                <span className="text-3xl font-bold text-white">
                  {formatPrice(priceData.price)}
                </span>
              </div>

              {/* Change Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${isPositiveChange
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
                }`}>
                {isPositiveChange ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-lg font-bold ${isPositiveChange ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {formatPercentage(priceData.changePercent24h)}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* 24h Change */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">24h Change</span>
                </div>
                <div className={`text-base font-bold ${priceData.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {formatPrice(priceData.change24h)}
                </div>
              </div>

              {/* 24h Volume */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">24h Volume</span>
                </div>
                <div className="text-base font-bold text-white" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  {priceData.volume24h ? formatPrice(priceData.volume24h) : 'N/A'}
                </div>
              </div>
            </div>

            {/* Market Cap (Full Width) */}
            {priceData.marketCap && (
              <div className="p-3 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">Market Cap</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {formatPrice(priceData.marketCap)}
                  </div>
                </div>
              </div>
            )}

            {/* Footer - Last Updated */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {priceData.timestamp
                    ? new Date(priceData.timestamp).toLocaleTimeString()
                    : 'N/A'}
                </span>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </div>
            </div>
          </div>
        ) : (
          // Loading Skeleton
          <div className="space-y-4 animate-pulse">
            {/* Main Price Skeleton */}
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <div className="h-3 bg-slate-700/50 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-700/50 rounded w-32"></div>
              </div>
              <div className="h-10 bg-slate-700/50 rounded-xl w-20"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="h-3 bg-slate-700/50 rounded w-16 mb-2"></div>
                <div className="h-5 bg-slate-700/50 rounded w-20"></div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="h-3 bg-slate-700/50 rounded w-16 mb-2"></div>
                <div className="h-5 bg-slate-700/50 rounded w-20"></div>
              </div>
            </div>

            {/* Market Cap Skeleton */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
              <div className="h-3 bg-slate-700/50 rounded w-20"></div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between pt-3 border-t border-slate-700/30">
              <div className="h-3 bg-slate-700/50 rounded w-24"></div>
              <div className="h-3 bg-slate-700/50 rounded w-12"></div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Border Effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isCrypto
          ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]'
          : 'shadow-[0_0_30px_rgba(34,197,94,0.3)]'
        }`}></div>
    </div>
  );
};

export default WatchlistCard;