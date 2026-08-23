import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, FolderTree, PackageCheck, AlertTriangle, FileText, CalendarClock, ArrowRight, DollarSign, TrendingUp, Users, ClipboardList, CreditCard, Settings, ShieldCheck
} from 'lucide-react';
import { productsApi } from '../../api/products';
import { ordersApi } from '../../api/orders';
import { Product } from '../../types/product';
import { Order } from '../../types/order';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = () => {
      Promise.all([
        productsApi.getProducts({ page_size: 100 }),
        ordersApi.getOrders({ page_size: 100 }),
      ]).then(([prodRes, ordRes]) => {
        if (prodRes.success && prodRes.data?.products) {
          setProducts(prodRes.data.products);
        }
        if (ordRes.success && ordRes.data) {
          setOrders(Array.isArray(ordRes.data) ? ordRes.data : ordRes.data.orders || []);
        }
      }).finally(() => setIsLoading(false));
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 2500);
    return () => clearInterval(interval);
  }, []);

  const validRevenueOrders = orders.filter(
    (o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED' && o.payment_status !== 'REFUNDED'
  );
  const totalRevenue = validRevenueOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const lowStockProducts = products.filter((p) => p.is_low_stock);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const readyOrders = orders.filter((o) => o.status === 'READY_FOR_PICKUP');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="dmart-card p-8 animate-pulse h-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="dmart-card p-6 h-28 animate-pulse"></div>
          <div className="dmart-card p-6 h-28 animate-pulse"></div>
          <div className="dmart-card p-6 h-28 animate-pulse"></div>
          <div className="dmart-card p-6 h-28 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-teal-600" /> Admin Control Center
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time business performance overview, sales stats, pickup capacity, and quick operational shortcuts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="dmart-select w-36"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dmart-card p-5 space-y-2 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.4% vs last week
          </span>
        </div>

        <div className="dmart-card p-5 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Orders</span>
            <PackageCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
          <span className="text-[11px] text-slate-500">
            {pendingOrders.length} pending, {readyOrders.length} ready
          </span>
        </div>

        <div className="dmart-card p-5 space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Catalog Products</span>
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
          <span className="text-[11px] text-slate-500">Active catalog items</span>
        </div>

        <div className="dmart-card p-5 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Low Stock Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{lowStockProducts.length}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Requires restock attention</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/admin/products" className="dmart-card p-4 dmart-card-hover flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Manage Products</h3>
              <p className="text-[11px] text-slate-500">Catalog & variants</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link to="/admin/orders" className="dmart-card p-4 dmart-card-hover flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Manage Orders</h3>
              <p className="text-[11px] text-slate-500">Status & refunds</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link to="/admin/pickup-slots" className="dmart-card p-4 dmart-card-hover flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Pickup Slots</h3>
              <p className="text-[11px] text-slate-500">Capacity & scheduling</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link to="/admin/audit-logs" className="dmart-card p-4 dmart-card-hover flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Audit Logs</h3>
              <p className="text-[11px] text-slate-500">Activity trails</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders List */}
        <div className="dmart-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-teal-600 hover:text-teal-700">View All</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No recent orders recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">#{ord.order_number}</span>
                    <p className="text-slate-500">{ord.customer_name || 'Customer'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{ord.total_amount}</span>
                    <p className="text-[10px] text-teal-700 font-semibold">{ord.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="dmart-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Alerts
            </h3>
            <Link to="/admin/inventory" className="text-xs font-semibold text-teal-600 hover:text-teal-700">Restock Page</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">All products have sufficient stock levels.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockProducts.slice(0, 5).map((prod) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={prod.image_url} alt="" className="w-7 h-7 object-cover rounded-lg border border-slate-200" />
                    <div>
                      <p className="font-semibold text-slate-900">{prod.name}</p>
                      <p className="text-slate-400">Min threshold: {prod.low_stock_threshold}</p>
                    </div>
                  </div>
                  <span className="badge-danger">{prod.stock_quantity} remaining</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
