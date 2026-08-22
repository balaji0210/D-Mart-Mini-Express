import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Bell, Menu, X, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NotificationDrawer } from '../ui/NotificationDrawer';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCustomerPage = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/staff');

  return (
    <>
      <header className="sticky top-0 z-40 dmart-navy-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Mini D-Mart
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    Express
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isCustomerPage && (
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300 ml-4">
                <Link to="/products" className="hover:text-teal-400 transition-colors">
                  Shop Products
                </Link>
                <Link to="/products?offers=true" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Offers
                </Link>

                {isAuthenticated && user?.role === 'CUSTOMER' && (
                  <Link to="/orders" className="hover:text-teal-400 transition-colors">
                    My Orders
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Staff / Admin Portal Switcher */}
            {isAuthenticated && (user?.role === 'STAFF' || user?.role === 'ADMIN') && (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/staff'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 text-xs font-semibold transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user.role === 'ADMIN' ? 'Admin Portal' : 'Staff Portal'}
              </Link>
            )}

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                onClick={() => setNotificationOpen(true)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-teal-500"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full" />
              </button>
            )}

            {/* Cart Icon (Customer storefront) */}
            {isCustomerPage && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-teal-500"
                title="Cart"
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {cart && cart.total_items > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-extrabold bg-teal-400 text-slate-950 rounded-full shadow-md">
                    {cart.total_items}
                  </span>
                )}
              </Link>
            )}

            {/* Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-teal-500"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-xs text-slate-200">
                    {user?.full_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" /> Account Settings
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" /> Admin Portal
                      </Link>
                    )}

                    {user?.role === 'STAFF' && (
                      <Link
                        to="/staff"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" /> Staff Portal
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-1.5 text-xs shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Shop Products
            </Link>
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                My Orders
              </Link>
            )}
            {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'STAFF') && (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/staff'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20"
              >
                Go to {user.role === 'ADMIN' ? 'Admin Portal' : 'Staff Portal'}
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  );
};
