import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Clock, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ARCHITECTURE_SPEC_TEXT = `# 🏗️ Mini D-Mart Express — System Architecture & Database Design
Enterprise grocery delivery and scheduled express pickup platform.

1. System Architecture: React 18 SPA + Django REST Framework + PostgreSQL / Supabase + 2.5s KV CloudSync.
2. PostgreSQL Relational Entities: users, categories, products, product_variants, carts, cart_items, stores, pickup_slots, orders, order_items, returns, inventory_adjustments, audit_logs, dmart_kv_store.
3. RBAC Roles: CUSTOMER, STAFF, ADMIN.
`;

export const Footer: React.FC = () => {
  const handleDirectDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const blob = new Blob([ARCHITECTURE_SPEC_TEXT], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mini_DMart_Architecture_and_DB_Design.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Architecture & DB Schema downloaded!');
    } catch (err) {
      toast.error('Failed to trigger download.');
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1 shadow-md">
                <img src="/favicon.png" alt="Mini D-Mart" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-xl font-black text-slate-100 tracking-tight">Mini D-Mart</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Enterprise grocery express platform. 10-Minute doorstep delivery & scheduled express pickup bays.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /> Express 10-Min Delivery</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Scheduled Express Pickup</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Easy 7-Day Returns</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">Portals & Workflows</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-emerald-400 transition">Customer Storefront</Link></li>
              <li><Link to="/staff" className="hover:text-emerald-400 transition">Staff Fulfillment Portal</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition">Admin Command Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">Architecture & Specs</h4>
            <div className="space-y-2.5">
              <Link
                to="/architecture"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold text-xs hover:bg-emerald-900 transition shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" /> View System Architecture
              </Link>
              <div>
                <button
                  onClick={handleDirectDownload}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 transition font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Instant Download (.md)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Mini D-Mart Express. Enterprise Grocery Platform Specification v1.0.0.</span>
          <div className="flex items-center gap-4">
            <Link to="/architecture" className="hover:underline text-slate-400">Architecture Diagrams</Link>
            <span>•</span>
            <button onClick={handleDirectDownload} className="hover:underline text-slate-400 cursor-pointer">
              Download DB Schema
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
