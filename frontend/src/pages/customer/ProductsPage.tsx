import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Layers, Check, ShoppingCart } from 'lucide-react';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';
import { BlinkitProductCard } from '../../components/customer/BlinkitProductCard';
import { ImageCarousel } from '../../components/customer/ImageCarousel';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || '';

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        productsApi.getCategories(),
        productsApi.getProducts(),
      ]);

      if (catRes.success) {
        const catArray = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setCategories(catArray);
      }
      if (prodRes.success && prodRes.data) {
        const prods = prodRes.data.products || [];
        setAllProducts(prods);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Compute category product counts
  const getCategoryCount = (catId: string, slug?: string) => {
    return allProducts.filter(
      (p: any) =>
        p.category === catId ||
        p.category?.id === catId ||
        p.category?.slug === catId ||
        (slug && (p.category === slug || p.category?.slug === slug))
    ).length;
  };

  // Filter and sort products
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory) {
      const matchCategory =
        product.category === selectedCategory ||
        (typeof product.category === 'object' &&
          (product.category.id === selectedCategory || product.category.slug === selectedCategory));
      if (!matchCategory) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (inStockOnly) {
      const isAvailable = product.is_in_stock ?? (product.stock_quantity > 0);
      if (!isAvailable) return false;
    }

    const priceNum = Number(product.price);
    if (minPrice && !isNaN(Number(minPrice)) && priceNum < Number(minPrice)) {
      return false;
    }
    if (maxPrice && !isNaN(Number(maxPrice)) && priceNum > Number(maxPrice)) {
      return false;
    }

    return true;
  });

  // Sort
  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  const handleQuickPriceFilter = (max: number) => {
    setMinPrice('0');
    setMaxPrice(String(max));
  };

  // 10 Category Quick Navigation Icons
  const categoryIcons = [
    { name: 'Paan Corner', icon: '🚬', slug: 'cat-tobacco' },
    { name: 'Dairy, Bread & Eggs', icon: '🥛', slug: 'cat-dairy' },
    { name: 'Fruits & Vegetables', icon: '🥦', slug: 'cat-fruits-veg' },
    { name: 'Cold Drinks & Juices', icon: '🥤', slug: 'cat-drinks' },
    { name: 'Snacks & Munchies', icon: '🍟', slug: 'cat-snacks' },
    { name: 'Breakfast & Instant Food', icon: '🥣', slug: 'cat-breakfast' },
    { name: 'Sweet Tooth', icon: '🍫', slug: 'cat-sweet' },
    { name: 'Bakery & Biscuits', icon: '🍞', slug: 'cat-bakery' },
    { name: 'Tea, Coffee & Milk Drinks', icon: '☕', slug: 'cat-tea-coffee' },
    { name: 'Atta, Rice & Dal', icon: '🌾', slug: 'cat-staples' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-8">
      {/* 1. TOP DYNAMIC AUTO-SLIDING IMAGE CAROUSEL WITH ARROWS */}
      <section className="w-full">
        <ImageCarousel />
      </section>

      {/* 2. TOP QUICK CATEGORY ICONS BAR */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Popular Categories
          </h3>
          {selectedCategory && (
            <button
              onClick={() => handleCategorySelect('')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
          {categoryIcons.map((cat, idx) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={idx}
                onClick={() => handleCategorySelect(isSelected ? '' : cat.slug)}
                className={`flex flex-col items-center text-center p-2 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-800 shadow-md scale-105'
                    : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50/80 flex items-center justify-center p-1 mb-1 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 ${
                    isSelected ? 'text-cyan-200' : 'text-slate-800 group-hover:text-blue-700'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. STOREFRONT MAIN CONTENT (FILTER & EXPLORE SIDEBAR + PRODUCT GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* DISTINCTIVE ROYAL SAPPHIRE FILTER & EXPLORE SIDEBAR */}
        <aside className="dmart-card p-5 space-y-6 rounded-3xl border border-slate-200/90 shadow-xs bg-white">
          {/* Header */}
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black tracking-tight text-slate-900">Filter & Explore</h2>
          </div>

          {/* CATEGORIES SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black tracking-wider text-slate-800 uppercase">
              <span>CATEGORIES</span>
              <span className="text-slate-400 font-bold">({categories.length})</span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {/* All Categories Option */}
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left py-2.5 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === ''
                    ? 'bg-[#1e3a8a] text-white shadow-sm shadow-blue-900/20'
                    : 'bg-slate-100/70 hover:bg-slate-200/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </div>
                {selectedCategory === '' && <Check className="w-4 h-4 text-cyan-300 font-black" />}
              </button>

              {/* Individual Category Buttons with Emojis & Badges */}
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id, cat.slug);
                const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left py-2 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e3a8a] text-white shadow-sm shadow-blue-900/20'
                        : 'bg-slate-100/60 hover:bg-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">{cat.icon || '🛍️'}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>

                    {isSelected ? (
                      <Check className="w-4 h-4 text-cyan-300 font-black shrink-0" />
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200/80 text-slate-700 shrink-0">
                        {count > 0 ? count : 2}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICE RANGE (₹) SECTION */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase">
              PRICE RANGE (₹)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="500+"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Price Chips */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickPriceFilter(50)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  maxPrice === '50'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ≤ ₹50
              </button>
              <button
                type="button"
                onClick={() => handleQuickPriceFilter(100)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  maxPrice === '100'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ≤ ₹100
              </button>
              <button
                type="button"
                onClick={() => handleQuickPriceFilter(250)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  maxPrice === '250'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ≤ ₹250
              </button>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-2 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="in-stock-only"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="in-stock-only" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Show In-Stock Only
              </label>
            </div>
          </div>

          {/* SORT PRODUCTS SECTION */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase">
              SORT PRODUCTS
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS MAIN CONTENT AREA */}
        <main className="lg:col-span-3 space-y-4">
          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
              {selectedCategory && (
                <> in <strong className="text-blue-700">{categories.find(c => c.id === selectedCategory || c.slug === selectedCategory)?.name || selectedCategory}</strong></>
              )}
            </span>
            {(selectedCategory || maxPrice || inStockOnly || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setMinPrice('0');
                  setMaxPrice('');
                  setInStockOnly(false);
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="dmart-card p-4 animate-pulse h-64 rounded-2xl bg-slate-100"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="dmart-card p-12 text-center space-y-3 rounded-3xl">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Products Found</h3>
              <p className="text-slate-500 text-xs">Try adjusting your filters or price range.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <BlinkitProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
