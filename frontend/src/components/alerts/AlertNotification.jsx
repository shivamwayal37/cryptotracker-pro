import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  Bell,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

const AlertNotification = ({ alert, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss after 8 seconds
    const autoDismissTimer = setTimeout(() => {
      handleDismiss();
    }, 8000);

    return () => clearTimeout(autoDismissTimer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const isAbove = alert.condition === 'ABOVE';
  const priceChanged = Math.abs(alert.currentPrice - alert.thresholdPrice);
  const percentChange = ((priceChanged / alert.thresholdPrice) * 100).toFixed(2);

  return (
    <div 
      className={`transform transition-all duration-300 ease-out ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative overflow-hidden backdrop-blur-xl bg-slate-800/95 rounded-2xl border-2 shadow-2xl max-w-sm">
        {/* Gradient Border Animation */}
        <div className={`absolute inset-0 opacity-50 ${
          isAbove 
            ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
            : 'bg-gradient-to-br from-red-500 to-orange-500'
        } blur-xl`}></div>

        {/* Animated Border */}
        <div className={`absolute inset-0 border-2 rounded-2xl ${
          isAbove ? 'border-emerald-500/50' : 'border-red-500/50'
        }`}></div>

        {/* Content Container */}
        <div className="relative bg-slate-800/90 rounded-2xl p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Animated Icon */}
              <div className={`relative p-3 rounded-xl animate-pulse ${
                isAbove 
                  ? 'bg-emerald-500/20 border border-emerald-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className={`absolute inset-0 rounded-xl animate-ping opacity-20 ${
                  isAbove ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
                {isAbove ? (
                  <TrendingUp className="relative w-6 h-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="relative w-6 h-6 text-red-400" />
                )}
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-300">
                    Price Alert Triggered
                  </h3>
                </div>
                <div className="text-lg font-bold text-white">
                  {alert.symbol}
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all text-slate-400 hover:text-white transform hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Details */}
          <div className="space-y-3">
            {/* Condition Badge */}
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl ${
              isAbove 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <CheckCircle className={`w-4 h-4 ${
                isAbove ? 'text-emerald-400' : 'text-red-400'
              }`} />
              <span className={`text-sm font-semibold ${
                isAbove ? 'text-emerald-300' : 'text-red-300'
              }`}>
                Price went {alert.condition.toLowerCase()} threshold
              </span>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-2 gap-3">
              {/* Threshold Price */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Threshold</span>
                </div>
                <div className="text-base font-bold text-white">
                  {formatPrice(alert.thresholdPrice)}
                </div>
              </div>

              {/* Current Price */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Current</span>
                </div>
                <div className={`text-base font-bold ${
                  isAbove ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatPrice(alert.currentPrice)}
                </div>
              </div>
            </div>

            {/* Change Summary */}
            <div className={`p-3 rounded-xl border ${
              isAbove 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Price Change</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${
                    isAbove ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isAbove ? '+' : '-'}{formatPrice(priceChanged)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    isAbove 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {isAbove ? '+' : '-'}{percentChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Timestamp */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {new Date(alert.triggeredAt).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {/* Auto-dismiss indicator */}
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500">Auto-dismiss in 8s</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/30 overflow-hidden">
            <div 
              className={`h-full ${
                isAbove ? 'bg-emerald-500' : 'bg-red-500'
              } animate-shrink-width`}
              style={{
                animation: 'shrinkWidth 8s linear forwards'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-shrink-width {
          animation: shrinkWidth 8s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default AlertNotification;