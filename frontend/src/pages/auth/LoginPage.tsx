import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        login(res.data.tokens, res.data.user);
        const role = res.data.user.role;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'STAFF') navigate('/staff');
        else navigate('/products');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Too many failed login attempts. Account temporarily throttled. Please wait 15 minutes.");
      } else {
        setError(err.response?.data?.message || 'Invalid email or password credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'CUSTOMER' | 'STAFF' | 'ADMIN') => {
    if (role === 'CUSTOMER') {
      setEmail('customer@dmart.com');
      setPassword('Customer@123');
    } else if (role === 'STAFF') {
      setEmail('staff@dmart.com');
      setPassword('Staff@123');
    } else if (role === 'ADMIN') {
      setEmail('admin@dmart.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full dmart-card p-8 shadow-xl border border-slate-200 relative overflow-hidden">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-600 mb-3 border border-teal-100 shadow-2xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-xs mt-1">Sign in to your Mini D-Mart portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@test.com"
                className="dmart-input pl-10"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="dmart-input pl-10"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Roles Quick Login */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" /> QUICK DEMO ACCOUNTS
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="px-4 py-1.5 text-xs rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-800 font-semibold border border-slate-200 transition-colors shadow-2xs"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('STAFF')}
              className="px-4 py-1.5 text-xs rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-800 font-semibold border border-slate-200 transition-colors shadow-2xs"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="px-4 py-1.5 text-xs rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-800 font-semibold border border-slate-200 transition-colors shadow-2xs"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
