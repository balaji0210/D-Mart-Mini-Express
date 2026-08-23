import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, Search, Layers, AlertTriangle, Flame, PackageCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Product, Category } from '../../types/product';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  });

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('15');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getProducts({ page_size: 150 }),
        productsApi.getCategories(),
      ]);
      if (prodRes.success && prodRes.data?.products) {
        setProducts(prodRes.data.products);
      }
      if (catRes.success) {
        const catArray = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setCategories(catArray);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isLowStock = (product: Product) => {
    const qty = Number(product.stock_quantity ?? 0);
    const threshold = Number(product.low_stock_threshold ?? 15);
    return qty <= threshold && qty > 0;
  };

  const isOutOfStock = (product: Product) => {
    const qty = Number(product.stock_quantity ?? 0);
    return qty <= 0 || product.is_in_stock === false;
  };

  const lowStockCount = products.filter(isLowStock).length;
  const outOfStockCount = products.filter(isOutOfStock).length;

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setLowStockThreshold('15');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(typeof product.category === 'object' ? product.category?.id || '' : product.category || '');
    setDescription(product.description);
    setPrice(String(product.price));
    setStockQuantity(String(product.stock_quantity ?? 0));
    setLowStockThreshold(String(product.low_stock_threshold ?? 15));
    setImageUrl(product.image_url);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const qty = Number(stockQuantity);
    const threshold = Number(lowStockThreshold);

    const payload = {
      name,
      category_id: categoryId,
      description,
      price: Number(price),
      stock_quantity: qty,
      low_stock_threshold: threshold,
      is_in_stock: qty > 0,
      is_low_stock: qty <= threshold && qty > 0,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    };

    try {
      if (editingProduct) {
        await productsApi.updateProduct(editingProduct.id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productsApi.createProduct(payload);
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleConfirmDelete = async () => {
    if (!deleteModal.productId) return;
    try {
      await productsApi.deleteProduct(deleteModal.productId);
      toast.success('Product deactivated.');
      await loadData();
    } catch (err) {
      toast.error('Failed to deactivate product.');
    } finally {
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  // Filter products by search and stock filter tabs
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    if (stockFilter === 'low') return isLowStock(p);
    if (stockFilter === 'out') return isOutOfStock(p);
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-700" /> Product & Inventory Administration
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time catalog pricing, stock level monitoring, and automated low-inventory threshold alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* TOP LOW INVENTORY ALERT BANNER (If any items are low or out of stock) */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                <span>Low Inventory Alert System Triggered</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                  {lowStockCount + outOfStockCount} SKUs Critical
                </span>
              </h3>
              <p className="text-xs text-amber-900/90 font-medium mt-0.5">
                {lowStockCount} items have fallen below their safety thresholds and {outOfStockCount} items are completely out of stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStockFilter('low')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-2xs transition cursor-pointer"
            >
              View Low Stock ({lowStockCount})
            </button>
            {outOfStockCount > 0 && (
              <button
                onClick={() => setStockFilter('out')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-2xs transition cursor-pointer"
              >
                View Out of Stock ({outOfStockCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stock Filter Pills & Search */}
      <div className="dmart-card p-4 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by product name..."
            className="dmart-input pl-10"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              stockFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              stockFilter === 'low'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-amber-800 hover:bg-amber-100/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              stockFilter === 'out'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-800 hover:bg-rose-100/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Out of Stock ({outOfStockCount})</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80 rounded-3xl bg-slate-100"></div>
      ) : filteredProducts.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3 rounded-3xl bg-white border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-700 text-sm font-bold">No products matching current filter criteria.</p>
          <button
            onClick={() => {
              setStockFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Shelf Stock Level</th>
                  <th className="p-4">Low Stock Threshold</th>
                  <th className="p-4">Inventory Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((product) => {
                  const qty = Number(product.stock_quantity ?? 0);
                  const threshold = Number(product.low_stock_threshold ?? 15);
                  const outOfStock = qty <= 0 || product.is_in_stock === false;
                  const lowStock = !outOfStock && (qty <= threshold || product.is_low_stock);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        outOfStock ? 'bg-rose-50/20' : lowStock ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-11 h-11 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
                            }}
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug">{product.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-800">
                        {typeof product.category === 'object' ? product.category?.name : product.category_name || 'Grocery'}
                      </td>
                      <td className="p-4 font-black text-slate-900 text-sm">
                        ₹{Number(product.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-black ${outOfStock ? 'text-rose-700' : lowStock ? 'text-amber-800' : 'text-slate-900'}`}>
                          {qty} units
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-600">
                        ≤ {threshold} units
                      </td>
                      <td className="p-4">
                        {outOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-black text-[11px]">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Out of Stock
                          </span>
                        ) : lowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-black text-[11px] animate-pulse">
                            <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> Low Stock Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-[11px]">
                            <PackageCheck className="w-3 h-3 text-emerald-600" /> Healthy Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* Quick Restock button for low/out of stock items */}
                        {(lowStock || outOfStock) && (
                          <button
                            onClick={() => handleFastRestock(product, 50)}
                            disabled={restockingId === product.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-2xs transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                            title="Restock +50 units"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{restockingId === product.id ? '...' : '+50'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, productId: product.id })}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] transition cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* Product Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Grocery Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. McVities Digestive Biscuits"
              className="dmart-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="dmart-input"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="67.00"
                className="dmart-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="80"
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                required
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                placeholder="15"
                className="dmart-input"
              />
              <span className="text-[10px] text-slate-500 font-medium">Alert triggers when stock falls at or below this value.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="dmart-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product details, weight, ingredients..."
              className="dmart-input"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Deactivate Product"
        message="Are you sure you want to deactivate this product from the customer catalog?"
        confirmText="Deactivate"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};
