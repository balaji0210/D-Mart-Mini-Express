import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Package,
  LogOut,
  MapPin,
  Sparkles,
  LayoutDashboard,
  Bell,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NotificationDrawer } from '../ui/NotificationDrawer';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCustomerPage = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/staff');

  return (
    <>
      {/* 1. TOP HEADER BAR (EXPANDED NAVBAR SIZE & PADDING) */}
      <header className="sticky top-0 z-40 bg-[#0f172a] text-white shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* LEFT: Logo & Brand + 10 MINS Delivery Badge */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Logo with enlarged icon & title */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🧺</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Mini D-Mart
                  </span>
                  <span className="text-xs uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950/80 text-cyan-300 border border-cyan-400/40">
                    ⚡ EXPRESS
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest text-cyan-300/90 uppercase -mt-0.5">
                  PREMIUM GROCERY EXPRESS
                </span>
              </div>
            </Link>

            {/* 10 MINS & Location Pill Badge (Enlarged) */}
            <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1e293b] border border-slate-700/80 text-xs sm:text-sm font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-amber-400 font-extrabold flex items-center gap-1">
                ⚡ 10 MINS
              </span>
              <span className="text-slate-500 font-normal">-</span>
              <span className="text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Home - 411048
              </span>
            </div>
          </div>

          {/* CENTER: Global Search Bar (Expanded width and padding) */}
          {isCustomerPage && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "milk", "lays", "paneer", "mango", "dry fruits"...'
                  className="w-full pl-11 pr-5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-full text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
                />
              </div>
            </form>
          )}

          {/* RIGHT: Action Controls (Orders, Cart, User Pill, Logout) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            
            {/* Orders Button */}
            {isCustomerPage && (
              <Link
                to={isAuthenticated ? "/orders" : "/login"}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <Package className="w-4.5 h-4.5 text-cyan-400" />
                <span>Orders</span>
              </Link>
            )}

            {/* Cart Button (Expanded) */}
            {isCustomerPage && (
              <Link
                to="/cart"
                className="flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <span>Cart</span>
                {cart && cart.total_items > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-xs">
                    {cart.total_items}
                  </span>
                )}
              </Link>
            )}

            {/* Staff / Admin Portal Switcher */}
            {isAuthenticated && (user?.role === 'STAFF' || user?.role === 'ADMIN') && (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/staff'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === 'ADMIN' ? 'Admin' : 'Staff'}
              </Link>
            )}

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                onClick={() => setNotificationOpen(true)}
                className="relative p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
              </button>
            )}

            {/* User Profile Pill */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-full hover:bg-slate-800 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-xs">
                    {user?.full_name?.charAt(0).toUpperCase() || 'B'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-black text-white leading-tight">
                      {user?.full_name?.toLowerCase() || 'balaji'}
                    </span>
                    <span className="text-[9px] font-black text-cyan-300 uppercase tracking-widest leading-none">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-md uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" /> Account Settings
                    </Link>

                    {user?.role === 'CUSTOMER' && (
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                      >
                        <Package className="w-4 h-4 text-slate-400" /> My Orders
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 hover:to-amber-400 shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Logout Exit Button */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-700 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
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

        {/* Mobile Search Bar */}
        {isCustomerPage && (
          <div className="md:hidden px-4 pb-3.5">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "milk", "chips", "paneer"...'
                className="w-full pl-11 pr-4 py-2.5 bg-white text-slate-900 rounded-full text-xs sm:text-sm font-bold focus:outline-none shadow-inner"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-slate-800"
            >
              Shop All Products
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-slate-800"
            >
              My Orders & History
            </Link>
          </div>
        )}
      </header>

      {/* 2. PROMOTIONAL FESTIVE RIBBON */}
      {isCustomerPage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-white p-3 sm:p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border border-indigo-800/40">
            {/* Left Content */}
            <div className="flex items-center gap-2.5 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span className="text-lg select-none">🪢</span>
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-xs">
                MEGA SAVINGS FEST
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                Celebrate with instant grocery delivery!
              </span>
              <span className="text-xs text-indigo-200 font-medium hidden md:inline">
                Designer Rakhis, Kaju Katli & Cadbury Gift Packs delivered in 10 mins 🎁
              </span>
            </div>

            {/* Right Promo Code Badge */}
            <div className="shrink-0">
              <Link
                to="/products?category=cat-sweet"
                className="px-4 py-1.5 rounded-full bg-indigo-900/80 border border-amber-400/60 text-amber-300 font-black text-xs flex items-center gap-1.5 hover:bg-indigo-800 transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Use Code: <strong className="text-white">RAKHI50</strong></span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  );
};
