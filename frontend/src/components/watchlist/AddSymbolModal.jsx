import React, { useState } from 'react';
import { COMMON_CRYPTO_SYMBOLS, COMMON_STOCK_SYMBOLS, SYMBOL_TYPES } from '../../utils/constants';
import { 
  X, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Bitcoin, 
  Plus,
  Sparkles,
  Check
} from 'lucide-react';

const AddSymbolModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    symbolType: SYMBOL_TYPES.CRYPTO
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuickPick, setSelectedQuickPick] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.symbol.trim()) return;

    setLoading(true);
    try {
      await onAdd(formData.symbol.toUpperCase(), formData.symbolType);
    } catch (error) {
      console.error('Error adding symbol:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSymbolSelect = (symbol) => {
    setFormData(prev => ({ ...prev, symbol }));
    setSelectedQuickPick(symbol);
  };

  const getCommonSymbols = () => {
    const symbols = formData.symbolType === SYMBOL_TYPES.CRYPTO 
      ? COMMON_CRYPTO_SYMBOLS 
      : COMMON_STOCK_SYMBOLS;
    
    // Filter by search term if provided
    if (searchTerm) {
      return symbols.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return symbols;
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, symbolType: type, symbol: '' }));
    setSelectedQuickPick(null);
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl animate-slideUp">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
        
        {/* Modal Card */}
        <div className="relative backdrop-blur-xl bg-slate-800/90 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/50">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Add to Watchlist
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Track your favorite assets in real-time
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Symbol Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Asset Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange(SYMBOL_TYPES.CRYPTO)}
                  className={`relative group overflow-hidden rounded-xl p-4 border-2 transition-all ${
                    formData.symbolType === SYMBOL_TYPES.CRYPTO
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      formData.symbolType === SYMBOL_TYPES.CRYPTO
                        ? 'bg-blue-500/20'
                        : 'bg-slate-700/50 group-hover:bg-slate-700'
                    }`}>
                      <Bitcoin className={`w-5 h-5 ${
                        formData.symbolType === SYMBOL_TYPES.CRYPTO
                          ? 'text-blue-400'
                          : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        formData.symbolType === SYMBOL_TYPES.CRYPTO
                          ? 'text-white'
                          : 'text-slate-300'
                      }`}>
                        Cryptocurrency
                      </div>
                      <div className="text-xs text-slate-500">BTC, ETH, ADA</div>
                    </div>
                  </div>
                  {formData.symbolType === SYMBOL_TYPES.CRYPTO && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange(SYMBOL_TYPES.STOCK)}
                  className={`relative group overflow-hidden rounded-xl p-4 border-2 transition-all ${
                    formData.symbolType === SYMBOL_TYPES.STOCK
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      formData.symbolType === SYMBOL_TYPES.STOCK
                        ? 'bg-purple-500/20'
                        : 'bg-slate-700/50 group-hover:bg-slate-700'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${
                        formData.symbolType === SYMBOL_TYPES.STOCK
                          ? 'text-purple-400'
                          : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        formData.symbolType === SYMBOL_TYPES.STOCK
                          ? 'text-white'
                          : 'text-slate-300'
                      }`}>
                        Stock
                      </div>
                      <div className="text-xs text-slate-500">AAPL, GOOGL, TSLA</div>
                    </div>
                  </div>
                  {formData.symbolType === SYMBOL_TYPES.STOCK && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Symbol Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Enter Symbol
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors ${
                    formData.symbolType === SYMBOL_TYPES.CRYPTO
                      ? 'text-blue-500 group-focus-within:text-blue-400'
                      : 'text-purple-500 group-focus-within:text-purple-400'
                  }`} />
                </div>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, symbol: e.target.value }));
                    setSelectedQuickPick(null);
                  }}
                  placeholder={`Enter ${formData.symbolType === SYMBOL_TYPES.CRYPTO ? 'crypto' : 'stock'} symbol...`}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                    formData.symbolType === SYMBOL_TYPES.CRYPTO
                      ? 'border-slate-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                      : 'border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Type manually or select from quick picks below</span>
              </p>
            </div>

            {/* Quick Picks Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-300">
                  Quick Picks
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter..."
                  className="w-32 px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-600/50 transition-all"
                />
              </div>
              
              <div className="relative">
                {/* Gradient Fade at edges */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-800/90 to-transparent pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-800/90 to-transparent pointer-events-none z-10"></div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900/30 rounded-xl border border-slate-700/30 custom-scrollbar">
                  {getCommonSymbols().map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleSymbolSelect(symbol)}
                      className={`relative group px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all transform hover:scale-105 ${
                        selectedQuickPick === symbol || formData.symbol.toUpperCase() === symbol
                          ? formData.symbolType === SYMBOL_TYPES.CRYPTO
                            ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20'
                            : 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                          : 'border-slate-700/50 bg-slate-800/50 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800'
                      }`}
                    >
                      {symbol}
                      {(selectedQuickPick === symbol || formData.symbol.toUpperCase() === symbol) && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.symbolType === SYMBOL_TYPES.CRYPTO
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {getCommonSymbols().length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No symbols found matching "{searchTerm}"
                </div>
              )}
            </div>

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
                disabled={loading || !formData.symbol.trim()}
                className={`relative flex-1 group overflow-hidden rounded-xl font-semibold transition-all ${
                  loading || !formData.symbol.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <div className={`absolute inset-0 transition-all ${
                  formData.symbolType === SYMBOL_TYPES.CRYPTO
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/50'
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/50'
                }`}></div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all ${
                  formData.symbolType === SYMBOL_TYPES.CRYPTO
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}></div>
                <div className="relative flex items-center justify-center space-x-2 py-3 text-white">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Info Footer */}
          <div className="px-6 pb-6">
            <div className={`p-4 rounded-xl border ${
              formData.symbolType === SYMBOL_TYPES.CRYPTO
                ? 'bg-blue-500/5 border-blue-500/20'
                : 'bg-purple-500/5 border-purple-500/20'
            }`}>
              <div className="flex items-start space-x-3">
                <DollarSign className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  formData.symbolType === SYMBOL_TYPES.CRYPTO
                    ? 'text-blue-400'
                    : 'text-purple-400'
                }`} />
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1">
                    {formData.symbolType === SYMBOL_TYPES.CRYPTO ? 'Crypto' : 'Stock'} symbols will be tracked in real-time
                  </p>
                  <p className="text-xs text-slate-500">
                    You'll receive instant price updates via WebSocket and can set custom alerts
                  </p>
                </div>
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AddSymbolModal;