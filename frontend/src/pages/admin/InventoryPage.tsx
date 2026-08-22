import React, { useState, useEffect } from 'react';
import { PackageCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = () => {
    setIsLoading(true);
    productsApi
      .getProducts({ page_size: 100 })
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

  const lowStockProds = products.filter((p) => p.is_low_stock);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" /> Inventory & Low Stock Alert Center
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Monitor product inventory levels reaching or falling below safety threshold bounds
          </p>
        </div>

        <button onClick={fetchInventory} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh Stock Levels
        </button>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-64"></div>
      ) : lowStockProds.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Inventory Status Healthy</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            All grocery products are currently above their configured low-stock alert thresholds.
          </p>
        </div>
      ) : (
        <div className="dmart-card border-amber-200 overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Attention Required: {lowStockProds.length} Products Low in Stock
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Alert Threshold</th>
                  <th className="p-4">Status Warning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockProds.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{product.name}</td>
                    <td className="p-4 text-xs font-semibold text-teal-700">
                      {typeof product.category === 'object' ? product.category?.name : product.category_name || 'Grocery'}
                    </td>
                    <td className="p-4 font-extrabold text-amber-700 text-base">
                      {product.stock_quantity} units
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-600">
                      {product.low_stock_threshold} units
                    </td>
                    <td className="p-4">
                      <span className="badge-warning">
                        Restock Required
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
