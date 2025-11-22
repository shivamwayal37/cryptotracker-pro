import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  X,
  Shield,
  Zap,
  Bell,
  BarChart3
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const result = await register(
        formData.username, 
        formData.email, 
        formData.password
      );
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-slate-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-slate-600';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && 
                         formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.confirmPassword && 
                             formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:block space-y-8">
          {/* Logo & Title */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <TrendingUp className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CryptoTracker Pro
                </h1>
                <p className="text-slate-400 text-sm mt-1">Start your investment journey</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl text-white font-light leading-relaxed mb-4">
                Join thousands of traders
                <span className="block font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  making smarter decisions
                </span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Get started in minutes with our free account and unlock powerful trading tools.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {[
              { icon: BarChart3, title: 'Real-time Market Data', desc: 'Track prices across all exchanges instantly' },
              { icon: Bell, title: 'Smart Price Alerts', desc: 'Never miss important market movements' },
              { icon: Shield, title: 'Bank-level Security', desc: 'Your data is encrypted and protected' },
              { icon: Zap, title: 'Lightning Fast Platform', desc: 'Built for speed and reliability' }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-4 p-4 backdrop-blur-sm bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all transform hover:translate-x-2"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-slate-400 text-xs mt-1">Active Users</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                $2B+
              </div>
              <div className="text-slate-400 text-xs mt-1">Assets Tracked</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                4.9★
              </div>
              <div className="text-slate-400 text-xs mt-1">User Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="relative">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
          
          {/* Register Card */}
          <div className="relative backdrop-blur-xl bg-slate-800/60 rounded-3xl border border-slate-700/50 shadow-2xl p-8 sm:p-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-slate-400">
                Start tracking your portfolio today
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength ? getPasswordStrengthColor() : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <p className={`text-xs ${
                        passwordStrength === 4 ? 'text-green-400' :
                        passwordStrength === 3 ? 'text-yellow-400' :
                        passwordStrength === 2 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        Password strength: {getPasswordStrengthText()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      passwordsMatch ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500/50' :
                      passwordsDontMatch ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' :
                      'border-slate-700/50 focus:ring-purple-500/50 focus:border-purple-500/50'
                    }`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-12 flex items-center">
                      {passwordsMatch ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {passwordsDontMatch && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-3 text-sm">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                />
                <label className="text-slate-400 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || passwordsDontMatch}
                className="relative w-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50 group-disabled:shadow-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-all"></div>
                <div className="relative flex items-center justify-center space-x-2 py-3.5 font-semibold text-white">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/60 text-slate-400">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all group"
              >
                <span className="font-medium">Sign in instead</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-slate-700/30">
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>Your information is protected with enterprise-grade encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Badge - Mobile Only */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="backdrop-blur-sm bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700/50 text-slate-400 text-xs flex items-center space-x-2">
          <Check className="w-3 h-3 text-green-500" />
          <span>Free account • No credit card required</span>
        </div>
      </div>
    </div>
  );
};

export default Register;