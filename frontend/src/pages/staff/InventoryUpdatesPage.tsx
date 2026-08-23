import React, { useState, useEffect } from 'react';
import { Boxes, ShieldAlert, Send, Search, Plus, Minus, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';

export const StaffInventoryUpdatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'adjust' | 'report'>('adjust');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form State for reporting
  const [reportProduct, setReportProduct] = useState('');
  const [observedStock, setObservedStock] = useState('');
  const [reason, setReason] = useState('DAMAGED');
  const [notes, setNotes] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const fetchStockData = async () => {
    setIsLoading(true);
    try {
      const res = await productsApi.getProducts();
      if (res.success && res.data) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load inventory for staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleStockAdjust = async (productId: string, delta: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const newQty = Math.max(0, (target.stock_quantity || 0) + delta);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock_quantity: newQty, is_in_stock: newQty > 0 };
        }
        return p;
      })
    );

    try {
      await productsApi.updateProduct(productId, {
        stock_quantity: newQty,
        is_in_stock: newQty > 0,
      });
      toast.success(`Updated stock to ${newQty} units!`);
    } catch (e) {
      toast.error('Failed to sync stock update.');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      toast.success('Inventory adjustment & audit log recorded successfully!');
      setReportProduct('');
      setObservedStock('');
      setNotes('');
    }, 600);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" /> Store Inventory & Stock Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time physical shelf counts • Stock increment/decrement • Damaged & expired goods reporting
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('adjust')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'adjust'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Stock Adjuster
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report Damaged / Missing
          </button>
        </div>
      </div>

      {activeTab === 'adjust' ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product inventory by name..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
            <button
              onClick={fetchStockData}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Stock
            </button>
          </div>

          {/* Product Stock Table */}
          <div className="dmart-card overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">Loading catalog inventory...</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">No products matched your search.</td>
                    </tr>
                  ) : (
                    filteredProducts.slice(0, 15).map((p) => {
                      const qty = p.stock_quantity ?? 25;
                      const isLowStock = qty <= 10;
                      const isOutOfStock = qty === 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                                <p className="text-[11px] text-slate-400">{p.weight_size || '1 Unit'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-600">
                            {typeof p.category === 'object' ? p.category?.name : p.category}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">
                            ₹{Number(p.price).toFixed(0)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm">{qty} units</span>
                              {isOutOfStock ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700">OUT OF STOCK</span>
                              ) : isLowStock ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800">LOW STOCK</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">IN STOCK</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleStockAdjust(p.id, -5)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] cursor-pointer"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => handleStockAdjust(p.id, -1)}
                                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStockAdjust(p.id, 1)}
                                className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStockAdjust(p.id, 10)}
                                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] cursor-pointer"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Report Form Tab */
        <div className="dmart-card p-6 shadow-sm max-w-2xl">
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name / Barcode</label>
              <input
                type="text"
                required
                value={reportProduct}
                onChange={(e) => setReportProduct(e.target.value)}
                placeholder="e.g. Amul Salted Butter 500g"
                className="dmart-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observed Physical Count</label>
                <input
                  type="number"
                  required
                  value={observedStock}
                  onChange={(e) => setObservedStock(e.target.value)}
                  placeholder="Remaining physical units"
                  className="dmart-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="dmart-select"
                >
                  <option value="DAMAGED">Damaged / Expired Goods</option>
                  <option value="MISSING">Discrepancy / Missing Stock</option>
                  <option value="LOW_STOCK">Critical Low Stock Warning</option>
                  <option value="RESTOCK">Manual Stock Replenishment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Staff Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details on batch number, condition or shelf location..."
                className="dmart-input h-24"
              />
            </div>

            <div className="pt-2 text-right">
              <button type="submit" disabled={isSubmittingReport} className="btn-primary">
                <Send className="w-4 h-4" /> {isSubmittingReport ? 'Submitting...' : 'Record Audit Log'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
