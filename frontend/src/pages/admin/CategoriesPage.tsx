import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Category } from '../../types/product';
import { Modal } from '../../components/ui/Modal';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await productsApi.getCategories();
      if (res.success) {
        const catArray = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setCategories(catArray);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name, description };
      if (editingCategory) {
        await productsApi.updateCategory(editingCategory.id, payload);
        toast.success('Category updated successfully!');
      } else {
        await productsApi.createCategory(payload);
        toast.success('Category created successfully!');
      }
      setModalOpen(false);
      setName('');
      setDescription('');
      await fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.name?.[0] || 'Failed to save category.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-teal-600" /> Category Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Organize grocery products into store departments and customer storefront categories
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-64"></div>
      ) : categories.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No store categories found.</p>
          <button onClick={openCreateModal} className="btn-primary inline-flex">
            <Plus className="w-4 h-4" /> Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="dmart-card p-5 flex flex-col justify-between space-y-4 dmart-card-hover">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                      <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        slug: {cat.slug}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description || 'General store grocery department.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => openEditModal(cat)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Category
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Grocery Category' : 'Add New Grocery Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Fruits & Vegetables"
              className="dmart-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh farm produce, fruits, vegetables, and greens..."
              className="dmart-input"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 text-sm"
          >
            {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
