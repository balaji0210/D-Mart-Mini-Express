import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Package,
  LogOut,
  MapPin,
  Zap,
  Tag,
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
      {/* 1. TOP HEADER BAR (EXACT DARK GREEN MATCHING SCREENSHOT) */}
      <header className="sticky top-0 z-40 bg-[#0a6635] text-white shadow-md border-b border-[#08522b]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* LEFT: Logo & Brand + 10 MINS Delivery Badge */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-[#ffc200] text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl">🧺</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Mini D-Mart
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#054c25] text-amber-300 border border-emerald-400/40">
                    ⚡ EXPRESS
                  </span>
                </div>
                <span className="text-[9px] font-black tracking-widest text-emerald-200 uppercase -mt-0.5">
                  FRESH FARM GROCERIES
                </span>
              </div>
            </Link>

            {/* 10 MINS & Location Pill Badge (Matching Screenshot) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#064e28] border border-emerald-500/30 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-amber-300 font-extrabold flex items-center gap-0.5">
                ⚡ 10 MINS
              </span>
              <span className="text-emerald-300 font-normal">-</span>
              <span className="text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-300" /> Home - 411048
              </span>
            </div>
          </div>

          {/* CENTER: Global Search Bar (Matching Screenshot) */}
          {isCustomerPage && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "milk", "lays", "paneer", "mango", "dry fruits"...'
                  className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                />
              </div>
            </form>
          )}

          {/* RIGHT: Action Controls (Orders, Cart, User Pill, Logout) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Orders Button (Matching Screenshot) */}
            {isCustomerPage && (
              <Link
                to={isAuthenticated ? "/orders" : "/login"}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white hover:text-amber-300 hover:bg-[#07532b] rounded-xl transition cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </Link>
            )}

            {/* Cart Button (Bright Cyan/Teal Pill matching Screenshot) */}
            {isCustomerPage && (
              <Link
                to="/cart"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00c58a] hover:bg-[#00b07c] text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {cart && cart.total_items > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-white text-[10px] font-black">
                    {cart.total_items}
                  </span>
                )}
              </Link>
            )}

            {/* Staff / Admin Portal Switcher */}
            {isAuthenticated && (user?.role === 'STAFF' || user?.role === 'ADMIN') && (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/staff'}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] hover:bg-amber-300 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user.role === 'ADMIN' ? 'Admin' : 'Staff'}
              </Link>
            )}

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                onClick={() => setNotificationOpen(true)}
                className="relative p-2 rounded-full text-emerald-100 hover:text-white hover:bg-[#07532b] transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
              </button>
            )}

            {/* User Profile Pill (Yellow avatar + Name + Role matching Screenshot) */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#07532b] transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ffc200] text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                    {user?.full_name?.charAt(0).toUpperCase() || 'B'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-black text-white leading-tight">
                      {user?.full_name?.toLowerCase() || 'balaji'}
                    </span>
                    <span className="text-[8px] font-black text-emerald-200 uppercase tracking-widest leading-none">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Account Settings
                    </Link>

                    {user?.role === 'CUSTOMER' && (
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                      >
                        <Package className="w-3.5 h-3.5 text-slate-400" /> My Orders
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-bold text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#07532b] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-full bg-[#ffc200] text-slate-950 font-black text-xs hover:bg-amber-300 shadow-xs transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Logout Exit Button (Matching Screenshot Icon) */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full bg-[#064e28] text-emerald-200 hover:text-white hover:bg-rose-700 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-emerald-100 hover:bg-[#07532b]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isCustomerPage && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "milk", "chips", "paneer"...'
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold focus:outline-none shadow-inner"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#07532b] border-t border-emerald-800 px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-[#0a6635]"
            >
              Shop All Products
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-[#0a6635]"
            >
              My Orders & History
            </Link>
          </div>
        )}
      </header>

      {/* 2. PROMOTIONAL FESTIVE RIBBON (EXACT MATCH TO SCREENSHOT) */}
      {isCustomerPage && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8b1528] via-[#a31b34] to-[#791223] text-white p-2.5 sm:p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 border border-red-900/40">
            {/* Left Content */}
            <div className="flex items-center gap-2.5 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span className="text-base select-none">🪢</span>
              <span className="px-3 py-1 rounded-full bg-[#ffc200] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
                MEGA SAVINGS FEST
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                Celebrate with instant grocery delivery!
              </span>
              <span className="text-xs text-rose-100 font-medium hidden md:inline">
                Designer Rakhis, Kaju Katli & Cadbury Gift Packs delivered in 10 mins 🎁
              </span>
            </div>

            {/* Right Promo Code Badge (Matching Screenshot) */}
            <div className="shrink-0">
              <Link
                to="/products?category=cat-sweet"
                className="px-3.5 py-1 rounded-full bg-[#520a16] border border-amber-400/60 text-amber-300 font-black text-xs flex items-center gap-1.5 hover:bg-[#3d0710] transition shadow-xs"
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
