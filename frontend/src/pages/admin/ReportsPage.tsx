import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, ShoppingBag, Users, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SALES' | 'PRODUCTS' | 'SLOTS' | 'STAFF'>('SALES');
  const [dateRange, setDateRange] = useState('7d');

  const exportReportCSV = () => {
    toast.success(`Exported ${activeTab.toLowerCase()} analytics report for period [${dateRange}] to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" /> Reports & Business Analytics
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Comprehensive business metrics, sales trends, inventory turnover, and fulfillment efficiency
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/architecture-docs.html"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm inline-flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4" /> Architecture & DB Docs
          </a>
          <a
            href="/ARCHITECTURE_AND_DATABASE_DESIGN.md"
            download="Mini_DMart_Architecture_and_DB_Design.md"
            className="btn-secondary py-2 text-xs"
          >
            <Download className="w-4 h-4" /> Download Docs (.md)
          </a>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="dmart-select w-36"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button onClick={exportReportCSV} className="btn-secondary py-2 text-xs">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('SALES')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'SALES'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sales & Revenue
        </button>
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'PRODUCTS'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Performance
        </button>
        <button
          onClick={() => setActiveTab('SLOTS')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'SLOTS'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pickup Slot Utilization
        </button>
        <button
          onClick={() => setActiveTab('STAFF')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'STAFF'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Staff Fulfillment
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'SALES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="dmart-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase">Gross Revenue</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">₹48,920.00</p>
              <span className="text-xs text-emerald-600 font-semibold">+14.2% vs previous period</span>
            </div>
            <div className="dmart-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">164</p>
              <span className="text-xs text-emerald-600 font-semibold">+8.5% order growth</span>
            </div>
            <div className="dmart-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase">Average Order Value</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">₹298.29</p>
              <span className="text-xs text-slate-500 font-medium">Consistent basket size</span>
            </div>
            <div className="dmart-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase">Completed Pickups</span>
              <p className="text-2xl font-extrabold text-teal-700 mt-1">98.1%</p>
              <span className="text-xs text-emerald-600 font-semibold">High fulfillment rate</span>
            </div>
          </div>

          {/* SVG Sales Trend Chart */}
          <div className="dmart-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Revenue Trend (₹)</h3>
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
              {[
                { day: 'Mon', val: 5200 },
                { day: 'Tue', val: 6800 },
                { day: 'Wed', val: 4900 },
                { day: 'Thu', val: 7400 },
                { day: 'Fri', val: 8900 },
                { day: 'Sat', val: 11200 },
                { day: 'Sun', val: 9500 }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{bar.val}
                  </div>
                  <div
                    style={{ height: `${(bar.val / 12000) * 100}%` }}
                    className="w-full bg-teal-500 rounded-t-lg group-hover:bg-teal-600 transition-all shadow-2xs"
                  />
                  <span className="text-xs font-semibold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Top Performing Products</h3>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Fresh Farm Whole Milk (1L)', sales: 340, revenue: '₹20,400' },
              { name: 'Whole Wheat Bread (400g)', sales: 280, revenue: '₹11,200' },
              { name: 'Organic Bananas (1 Dozen)', sales: 210, revenue: '₹10,500' },
              { name: 'Basmati Rice (5kg)', sales: 95, revenue: '₹33,250' }
            ].map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-slate-400">{p.sales} units sold</p>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SLOTS' && (
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Pickup Slot Utilization Rate</h3>
          <div className="space-y-4 text-xs">
            {[
              { time: '09:00 AM - 10:00 AM', utilization: 85 },
              { time: '10:00 AM - 11:00 AM', utilization: 100 },
              { time: '04:00 PM - 05:00 PM', utilization: 95 },
              { time: '05:00 PM - 06:00 PM', utilization: 60 }
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">{s.time}</span>
                  <span className="text-teal-700 font-bold">{s.utilization}% Booked</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.utilization}%` }}
                    className={`h-full ${s.utilization >= 100 ? 'bg-amber-500' : 'bg-teal-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'STAFF' && (
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Staff Order Processing Efficiency</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { staff: 'Sunil Verma', role: 'STAFF', completed: 48, avgTime: '6.4 mins' },
              { staff: 'Pooja Singh', role: 'STAFF', completed: 52, avgTime: '5.8 mins' }
            ].map((st, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{st.staff}</p>
                  <p className="text-slate-400">Avg Prep Time: {st.avgTime}</p>
                </div>
                <span className="badge-success">{st.completed} Orders Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
