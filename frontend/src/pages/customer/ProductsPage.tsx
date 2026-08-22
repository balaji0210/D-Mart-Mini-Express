import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Check, AlertTriangle, Layers, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Category, Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const ProductsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [addingId, setAddingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        productsApi.getCategories(),
        productsApi.getProducts({
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          in_stock: inStockOnly || undefined,
        }),
      ]);

      if (catRes.success) {
        const catArray = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setCategories(catArray);
      }
      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, inStockOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      toast.error('Only customers can add items to cart.');
      return;
    }

    setAddingId(product.id);
    try {
      const ok = await addToCart(product.id, 1);
      if (ok) {
        toast.success(`Added "${product.name}" to cart!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grocery Storefront Catalog</h1>
          <p className="text-slate-500 text-xs mt-1">Explore fresh produce, dairy, breads, and daily pantry staples</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="dmart-input pl-10 pr-24"
          />
          <button
            type="submit"
            className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 py-1.5 px-3 text-xs"
          >
            Search
          </button>
        </form>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="dmart-card p-6 space-y-6 h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3 text-sm">
            <Filter className="w-4 h-4 text-teal-600" /> Categories & Filters
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedCategory('')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === ''
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="dmart-card p-4 animate-pulse h-80"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="dmart-card p-12 text-center space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Products Available</h3>
              <p className="text-slate-500 text-xs">Try selecting a different category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isAvailable = product.is_in_stock ?? (product.stock_quantity > 0);
                return (
                  <div
                    key={product.id}
                    className="dmart-card overflow-hidden flex flex-col dmart-card-hover"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
                        }}
                      />

                      {product.is_low_stock && product.stock_quantity > 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                          <AlertTriangle className="w-3 h-3" /> Low Stock: {product.stock_quantity}
                        </div>
                      )}

                      {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
                          <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-lg font-extrabold text-teal-800">
                            ₹{Number(product.price).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!isAvailable || addingId === product.id}
                          className="btn-primary py-1.5 px-3 text-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {addingId === product.id ? 'Adding...' : isAvailable ? 'Add' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
