import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, User } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

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
      } else if (!err.response) {
        setError("Unable to connect to backend server. Please verify your VITE_API_URL and ensure the backend is running.");
      } else {
        setError(err.response?.data?.message || 'Invalid email or password credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full dmart-card p-8 shadow-xl border border-slate-200 relative overflow-hidden rounded-3xl bg-white">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-3 border border-emerald-200 shadow-2xs">
            <span className="text-3xl">🧺</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-xs mt-1">Sign in to your Mini D-Mart Express portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="dmart-input pl-10"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-emerald-700 hover:underline">
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
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-CLICK DEMO TEST CREDENTIALS */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">
            Quick 1-Click Role Credentials
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@dmart.com', 'Admin@1234')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-extrabold text-[11px] transition text-center cursor-pointer flex flex-col items-center gap-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('staff@dmart.com', 'Staff@1234')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-[11px] transition text-center cursor-pointer flex flex-col items-center gap-0.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('customer@dmart.com', 'Customer@1234')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-[11px] transition text-center cursor-pointer flex flex-col items-center gap-0.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-700 font-extrabold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
