import React, { useState, useEffect } from 'react';
import { PackageCheck, AlertTriangle, RefreshCw, Flame, Plus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const fetchInventory = () => {
    setIsLoading(true);
    productsApi
      .getProducts({ page_size: 150 })
      .then((res) => {
        if (res.success && res.data?.products) {
          setProducts(res.data.products);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const isLowStock = (product: Product) => {
    const qty = Number(product.stock_quantity ?? 0);
    const threshold = Number(product.low_stock_threshold ?? 15);
    return qty <= threshold;
  };

  const lowStockProds = products.filter(isLowStock);

  const handleFastRestock = async (product: Product, addAmount = 50) => {
    setRestockingId(product.id);
    try {
      const newQty = (product.stock_quantity || 0) + addAmount;
      const threshold = product.low_stock_threshold || 15;
      await productsApi.updateProduct(product.id, {
        stock_quantity: newQty,
        is_in_stock: true,
        is_low_stock: newQty <= threshold,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, stock_quantity: newQty, is_in_stock: true, is_low_stock: newQty <= threshold }
            : p
        )
      );
      toast.success(`Restocked +${addAmount} units for "${product.name.slice(0, 18)}"!`);
    } catch (err) {
      toast.error('Failed to restock item.');
    } finally {
      setRestockingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-600" /> Inventory & Low Stock Alert Center
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Automatic tracking for items reaching or falling below safety threshold bounds
          </p>
        </div>

        <button onClick={fetchInventory} className="btn-secondary">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Stock Levels
        </button>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-64 rounded-3xl bg-slate-100"></div>
      ) : lowStockProds.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">Inventory Status Healthy</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            All grocery products are currently above their configured low-stock alert thresholds.
          </p>
        </div>
      ) : (
        <div className="dmart-card rounded-3xl border border-amber-300 bg-white shadow-xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-b border-amber-200 flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" /> Attention Required: {lowStockProds.length} Products Low in Stock
            </span>
            <span className="text-[11px] text-amber-900 font-bold">
              Automatic alert triggers when shelf count ≤ threshold
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Alert Threshold</th>
                  <th className="p-4">Status Warning</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {lowStockProds.map((product) => {
                  const qty = Number(product.stock_quantity ?? 0);
                  const threshold = Number(product.low_stock_threshold ?? 15);
                  const isOut = qty <= 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0"
                          />
                          <span className="text-xs sm:text-sm font-black text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-800">
                        {typeof product.category === 'object' ? product.category?.name : product.category_name || 'Grocery'}
                      </td>
                      <td className="p-4 font-black text-amber-800 text-sm">
                        {qty} units
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-600">
                        ≤ {threshold} units
                      </td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-black text-[10px]">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-black text-[10px] animate-pulse">
                            <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> Low Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleFastRestock(product, 50)}
                          disabled={restockingId === product.id}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{restockingId === product.id ? 'Restocking...' : 'Restock +50 Units'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
