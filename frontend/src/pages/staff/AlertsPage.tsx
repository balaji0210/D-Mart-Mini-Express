import React, { useState, useEffect } from 'react';
import { BellRing, AlertTriangle, Clock, CheckCircle2, Flame, RefreshCw, Plus, PackageCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';

export const StaffAlertsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const fetchLowStockData = async () => {
    setIsLoading(true);
    try {
      const res = await productsApi.getProducts();
      if (res.success && res.data) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products for alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockData();
  }, []);

  // Filter low stock and out of stock items
  const lowStockItems = products.filter((p) => {
    const qty = p.stock_quantity ?? 50;
    const threshold = p.low_stock_threshold || 15;
    return qty <= threshold;
  });

  const handleRestock = async (product: Product, addAmount = 50) => {
    setRestockingId(product.id);
    try {
      const newQty = (product.stock_quantity || 0) + addAmount;
      await productsApi.updateProduct(product.id, {
        stock_quantity: newQty,
        is_in_stock: true,
        is_low_stock: false,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, stock_quantity: newQty, is_in_stock: true, is_low_stock: false }
            : p
        )
      );

      toast.success(`Successfully restocked +${addAmount} units for "${product.name.slice(0, 20)}"!`);
    } catch (err) {
      toast.error('Failed to restock item.');
    } finally {
      setRestockingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-600" /> Operational & Low Stock Alerts
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Live monitoring for low-stock inventory thresholds, out-of-stock SKUs, and fulfillment warnings
          </p>
        </div>

        <button
          onClick={fetchLowStockData}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Alerts
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dmart-card p-4 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900">Low Stock SKUs</span>
            <p className="text-2xl font-black text-amber-950">{lowStockItems.length}</p>
          </div>
        </div>

        <div className="dmart-card p-4 rounded-2xl border border-rose-200 bg-rose-50/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-900">Out of Stock SKUs</span>
            <p className="text-2xl font-black text-rose-950">
              {lowStockItems.filter((i) => (i.stock_quantity || 0) <= 0).length}
            </p>
          </div>
        </div>

        <div className="dmart-card p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-900">Healthy Stock SKUs</span>
            <p className="text-2xl font-black text-emerald-950">
              {Math.max(0, products.length - lowStockItems.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Items Action Table */}
      <div className="dmart-card p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600" /> Active Inventory Alerts ({lowStockItems.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Automatic alert triggered when stock ≤ threshold</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-2xl bg-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : lowStockItems.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">All Inventory Levels Healthy</h3>
            <p className="text-xs text-slate-500">No items are currently below their minimum threshold.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.map((item) => {
              const qty = item.stock_quantity ?? 0;
              const threshold = item.low_stock_threshold || 15;
              const isOut = qty <= 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    isOut
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">{item.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            isOut
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {isOut ? 'OUT OF STOCK' : 'LOW STOCK'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Current Shelf Count: <strong className="text-slate-900">{qty} units</strong> • Minimum Threshold: <strong className="text-slate-700">{threshold} units</strong>
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Fast Restock Action */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleRestock(item, 50)}
                      disabled={restockingId === item.id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{restockingId === item.id ? 'Restocking...' : 'Restock +50 Units'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Operational Schedule Alerts */}
      <div className="dmart-card p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> Operational & Pickup Schedule Notices
        </h2>
        <div className="space-y-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
            <Clock className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-extrabold text-blue-950">Active Pickup Window Notice</p>
              <p className="text-blue-800 text-[11px] mt-0.5">Orders in the 09:00 - 11:00 AM slot must be fully packed and staged on Shelf Bay A.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-extrabold text-emerald-950">Automatic Restock Sync Active</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">Stock changes made by staff update customer catalogs in real-time across all browser devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
