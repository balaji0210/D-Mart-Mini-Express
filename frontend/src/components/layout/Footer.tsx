import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-100">Mini D-Mart</span>
            </div>
            <p className="text-sm text-slate-400">
              Enterprise-grade e-commerce grocery store. Scheduled pickup & home delivery.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /> Express Delivery</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Scheduled Store Pickup</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Easy 7-Day Returns</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Customer Roles</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Customer Portal</li>
              <li>Staff Fulfillment Operations</li>
              <li>Admin Audit & Management</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Security & System</h4>
            <p className="text-xs text-slate-400">
              Built with Django REST Framework, Simple JWT, React 18, and PostgreSQL with atomic inventory locking.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Mini D-Mart. All rights reserved. Enterprise Grocery Platform Specification v1.0.0.
        </div>
      </div>
    </footer>
  );
};
