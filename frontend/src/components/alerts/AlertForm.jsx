import React, { useState } from 'react';
import { ALERT_CONDITIONS } from '../../utils/constants';
import { 
  X, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertCircle,
  Check,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';

const AlertForm = ({ symbol, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    symbol: symbol || '',
    thresholdPrice: '',
    condition: ALERT_CONDITIONS.ABOVE
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.thresholdPrice) return;

    setLoading(true);
    try {
      await onSubmit(
        formData.symbol,
        parseFloat(formData.thresholdPrice),
        formData.condition
      );
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAbove = formData.condition === ALERT_CONDITIONS.ABOVE;
  const hasValidData = formData.symbol && formData.thresholdPrice;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg animate-slideUp">
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 ${
          isAbove 
            ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
            : 'bg-gradient-to-r from-red-500 to-orange-500'
        }`}></div>
        
        {/* Modal Card */}
        <div className="relative backdrop-blur-xl bg-slate-800/90 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className={`relative border-b border-slate-700/50 p-6 ${
            isAbove 
              ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20' 
              : 'bg-gradient-to-r from-red-600/20 to-orange-600/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl shadow-lg ${
                  isAbove 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/50' 
                    : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/50'
                }`}>
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Create Price Alert
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Get notified when price reaches your target
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white transform hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Symbol Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Symbol
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Sparkles className={`w-5 h-5 transition-colors ${
                    isAbove 
                      ? 'text-emerald-500 group-focus-within:text-emerald-400' 
                      : 'text-red-500 group-focus-within:text-red-400'
                  }`} />
                </div>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="Enter symbol (e.g., BTC, AAPL)"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                    isAbove
                      ? 'border-slate-700/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-700/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Condition Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Alert Condition
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Above Button */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition: ALERT_CONDITIONS.ABOVE }))}
                  className={`relative group overflow-hidden rounded-xl p-4 border-2 transition-all ${
                    isAbove
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      isAbove
                        ? 'bg-emerald-500/20'
                        : 'bg-slate-700/50 group-hover:bg-slate-700'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${
                        isAbove ? 'text-emerald-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        isAbove ? 'text-white' : 'text-slate-300'
                      }`}>
                        Above
                      </div>
                      <div className="text-xs text-slate-500">Price goes up</div>
                    </div>
                  </div>
                  {isAbove && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>

                {/* Below Button */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition: ALERT_CONDITIONS.BELOW }))}
                  className={`relative group overflow-hidden rounded-xl p-4 border-2 transition-all ${
                    !isAbove
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      !isAbove
                        ? 'bg-red-500/20'
                        : 'bg-slate-700/50 group-hover:bg-slate-700'
                    }`}>
                      <TrendingDown className={`w-5 h-5 ${
                        !isAbove ? 'text-red-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        !isAbove ? 'text-white' : 'text-slate-300'
                      }`}>
                        Below
                      </div>
                      <div className="text-xs text-slate-500">Price goes down</div>
                    </div>
                  </div>
                  {!isAbove && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Threshold Price Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Target Price (USD)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className={`w-5 h-5 transition-colors ${
                    isAbove 
                      ? 'text-emerald-500 group-focus-within:text-emerald-400' 
                      : 'text-red-500 group-focus-within:text-red-400'
                  }`} />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.thresholdPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, thresholdPrice: e.target.value }))}
                  placeholder="Enter target price"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                    isAbove
                      ? 'border-slate-700/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-700/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Preview Card */}
            {hasValidData && (
              <div className={`p-4 rounded-xl border animate-fadeIn ${
                isAbove 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isAbove ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    <AlertCircle className={`w-5 h-5 ${
                      isAbove ? 'text-emerald-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      Alert Summary
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You will be notified when{' '}
                      <span className="font-bold text-white">{formData.symbol}</span>
                      {' '}price goes{' '}
                      <span className={`font-bold ${
                        isAbove ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isAbove ? 'above' : 'below'}
                      </span>
                      {' '}<span className="font-bold text-white">
                        ${parseFloat(formData.thresholdPrice).toLocaleString(undefined, { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </p>
                  </div>
                  {isAbove ? (
                    <ArrowUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-slate-700/30">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !hasValidData}
                className={`relative flex-1 group overflow-hidden rounded-xl font-semibold transition-all ${
                  loading || !hasValidData
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <div className={`absolute inset-0 transition-all ${
                  isAbove
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 group-hover:shadow-lg group-hover:shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 group-hover:shadow-lg group-hover:shadow-red-500/50'
                }`}></div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all ${
                  isAbove
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}></div>
                <div className="relative flex items-center justify-center space-x-2 py-3 text-white">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Alert...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>Create Alert</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Info Footer */}
          <div className="px-6 pb-6">
            <div className={`p-3 rounded-xl border ${
              isAbove
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Check className="w-3.5 h-3.5" />
                <span>
                  Real-time monitoring • Instant notifications • Manage alerts anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AlertForm;