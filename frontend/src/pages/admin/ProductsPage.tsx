import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, Search, Layers } from 'lucide-react';
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null
  });

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getProducts({ page_size: 100 }),
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

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setLowStockThreshold('10');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(typeof product.category === 'object' ? product.category?.id || '' : product.category || '');
    setDescription(product.description);
    setPrice(String(product.price));
    setStockQuantity(String(product.stock_quantity));
    setLowStockThreshold(String(product.low_stock_threshold));
    setImageUrl(product.image_url);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      category_id: categoryId,
      description,
      price: Number(price),
      stock_quantity: Number(stockQuantity),
      low_stock_threshold: Number(lowStockThreshold),
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-teal-600" /> Product Administration
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage grocery catalog, pricing, inventory stock, and alert thresholds
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="dmart-card p-4 flex items-center justify-between">
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

      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredProducts.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No products matching your search.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Threshold</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-xl bg-slate-100 border border-slate-200"
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
                          }}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-teal-700">
                      {typeof product.category === 'object' ? product.category?.name : product.category_name || 'Grocery'}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td className="p-4">
                      {product.is_low_stock ? (
                        <span className="badge-warning">
                          {product.stock_quantity} Low
                        </span>
                      ) : (
                        <span className="badge-success">
                          {product.stock_quantity} In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-600">
                      {product.low_stock_threshold} units
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, productId: product.id })}
                        className="btn-outline-danger py-1 px-2.5 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fresh Organic Apples 1kg"
              className="dmart-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="dmart-select"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120.00"
                className="dmart-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="50"
                className="dmart-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                required
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                placeholder="10"
                className="dmart-input"
              />
            </div>
          </div>

          {/* Product Image URL & Live Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Product Image URL / Image Link <span className="text-teal-600 font-normal">(Direct HTTP/HTTPS link)</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="dmart-input flex-1 text-xs"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
                  }}
                />
              )}
            </div>

            {/* Quick Image Presets */}
            <div>
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Or pick a quick image preset:</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🍚 Rice/Grains
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🌾 Wheat/Atta
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🥛 Milk/Dairy
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  ☕ Tea/Coffee
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🍎 Fruits
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🥬 Veggies
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  🌻 Cooking Oil
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh farm crisp organic red apples..."
              className="dmart-input"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 text-sm"
          >
            {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Deactivate Product"
        message="Are you sure you want to deactivate this product from the catalog?"
        confirmText="Deactivate Product"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null })}
      />
    </div>
  );
};
