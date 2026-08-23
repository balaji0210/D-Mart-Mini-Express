import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Layers, Check, ShoppingCart } from 'lucide-react';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';
import { BlinkitProductCard } from '../../components/customer/BlinkitProductCard';
import { CategoryProductRow } from '../../components/customer/CategoryProductRow';
import { ImageCarousel } from '../../components/customer/ImageCarousel';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || '';

  const [categories, setCategories] = useState<any[]>([]);
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

  const getProdsByCategory = (catIdentifier: string) => {
    return allProducts.filter(
      (p: any) =>
        p.category === catIdentifier ||
        p.category?.id === catIdentifier ||
        p.category?.slug === catIdentifier ||
        (typeof p.category === 'string' && p.category.toLowerCase().includes(catIdentifier.toLowerCase())) ||
        (typeof p.category?.slug === 'string' && p.category.slug.toLowerCase().includes(catIdentifier.toLowerCase()))
    );
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
    { name: 'Breakfast & Cereals', icon: '🥣', slug: 'cat-breakfast' },
    { name: 'Dairy, Bread & Eggs', icon: '🥛', slug: 'cat-dairy' },
    { name: 'Cold Drinks & Juices', icon: '🥤', slug: 'cat-drinks' },
    { name: 'Snacks & Munchies', icon: '🍟', slug: 'cat-snacks' },
    { name: 'Fruits & Vegetables', icon: '🥦', slug: 'cat-fruits-veg' },
    { name: 'Sweet Tooth', icon: '🍫', slug: 'cat-sweet' },
    { name: 'Paan Corner', icon: '🚬', slug: 'cat-tobacco' },
    { name: 'Bakery & Biscuits', icon: '🍞', slug: 'cat-bakery' },
    { name: 'Tea & Coffee', icon: '☕', slug: 'cat-tea-coffee' },
    { name: 'Atta, Rice & Dal', icon: '🌾', slug: 'cat-staples' },
  ];

  const isDefaultLanding = !selectedCategory && !searchQuery && !maxPrice && !inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-8">
      {/* 1. TOP DYNAMIC AUTO-SLIDING IMAGE CAROUSEL */}
      <section className="w-full">
        <ImageCarousel />
      </section>

      {/* 2. TOP QUICK CATEGORY ICONS BAR (MILD & FRESH) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Popular Categories
          </h3>
          <span className="text-xs text-slate-500 font-medium">Explore 10+ express grocery aisles</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
          {categoryIcons.map((cat, idx) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[95px] sm:min-w-[105px] shrink-0 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 shadow-md shadow-emerald-500/10'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl mb-1.5 shadow-2xs">
                  {cat.icon}
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN SECTION: SIDEBAR FILTER + CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR FILTER (MILD LIGHT THEME) */}
        <aside className="dmart-card p-5 rounded-3xl border border-slate-200 shadow-xs space-y-6 bg-white sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black tracking-wider uppercase">FILTERS</span>
            </div>
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
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </div>
                {selectedCategory === '' && <Check className="w-4 h-4 text-white font-black" />}
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
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">{cat.icon || '🛍️'}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>

                    {isSelected ? (
                      <Check className="w-4 h-4 text-white font-black shrink-0" />
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200/70 text-slate-700 shrink-0">
                        {count > 0 ? count : 4}
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="500+"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-extrabold shadow-2xs'
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
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-extrabold shadow-2xs'
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
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-extrabold shadow-2xs'
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
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="in-stock-only" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Show In-Stock Only
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
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS MAIN CONTENT AREA */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
              {selectedCategory && (
                <> in <strong className="text-emerald-700">{categories.find(c => c.id === selectedCategory || c.slug === selectedCategory)?.name || selectedCategory}</strong></>
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
          ) : isDefaultLanding ? (
            /* DEFAULT LANDING: RICH HORIZONTAL CATEGORY ROWS MATCHING SCREENSHOT */
            <div className="space-y-8">
              {/* Breakfast & Cereals (Screenshot 1 Reference) */}
              <CategoryProductRow
                title="Breakfast & Cereals"
                categoryId="cat-breakfast"
                icon="🥣"
                subtitle="Fresh stock ready for 10-minute doorstep delivery"
                products={getProdsByCategory('breakfast').length > 0 ? getProdsByCategory('breakfast') : allProducts.slice(0, 4)}
              />

              {/* Cooking Essentials (Screenshot 2 Reference) */}
              <CategoryProductRow
                title="Cooking Essentials"
                categoryId="cat-cooking"
                icon="🍳"
                subtitle="Fresh stock ready for 10-minute doorstep delivery"
                products={getProdsByCategory('cooking').length > 0 ? getProdsByCategory('cooking') : allProducts.slice(4, 7)}
              />

              {/* Dairy, Bread & Eggs */}
              <CategoryProductRow
                title="Dairy, Bread & Eggs"
                categoryId="cat-dairy"
                icon="🥛"
                subtitle="Farm fresh milk, curd, eggs and breakfast essentials"
                products={getProdsByCategory('dairy').length > 0 ? getProdsByCategory('dairy') : allProducts.slice(2, 8)}
              />

              {/* Cold Drinks & Juices */}
              <CategoryProductRow
                title="Cold Drinks & Juices"
                categoryId="cat-drinks"
                icon="🥤"
                subtitle="Icy cold sodas, fruit juices & instant hydration"
                products={getProdsByCategory('drinks').length > 0 ? getProdsByCategory('drinks') : allProducts.slice(4, 10)}
              />

              {/* Snacks & Munchies */}
              <CategoryProductRow
                title="Snacks & Munchies"
                categoryId="cat-snacks"
                icon="🍟"
                subtitle="Crispy chips, roasted nuts & party munchies"
                products={getProdsByCategory('snacks').length > 0 ? getProdsByCategory('snacks') : allProducts.slice(0, 6)}
              />

              {/* Fruits & Vegetables */}
              <CategoryProductRow
                title="Fruits & Vegetables"
                categoryId="cat-fruits-veg"
                icon="🥦"
                subtitle="Handpicked farm fresh vegetables & organic fruits"
                products={getProdsByCategory('fruits').length > 0 ? getProdsByCategory('fruits') : allProducts.slice(3, 7)}
              />

              {/* Sweet Tooth & Desserts */}
              <CategoryProductRow
                title="Sweet Tooth & Desserts"
                categoryId="cat-sweet"
                icon="🍫"
                subtitle="Ice cream tubs, festive sweets & chocolates"
                products={getProdsByCategory('sweet').length > 0 ? getProdsByCategory('sweet') : allProducts.slice(1, 7)}
              />

              {/* Bakery & Biscuits */}
              <CategoryProductRow
                title="Bakery & Biscuits"
                categoryId="cat-bakery"
                icon="🍞"
                subtitle="Oven fresh breads, crunchy cookies & rusks"
                products={getProdsByCategory('bakery').length > 0 ? getProdsByCategory('bakery') : allProducts.slice(2, 6)}
              />

              {/* Tea, Coffee & Milk Drinks */}
              <CategoryProductRow
                title="Tea, Coffee & Drinks"
                categoryId="cat-tea-coffee"
                icon="☕"
                subtitle="Aromatic chai leaves, roast coffee & health mixes"
                products={getProdsByCategory('tea').length > 0 ? getProdsByCategory('tea') : allProducts.slice(0, 4)}
              />

              {/* Atta, Rice & Dal */}
              <CategoryProductRow
                title="Atta, Rice & Dal"
                categoryId="cat-staples"
                icon="🌾"
                subtitle="Premium grains, unpolished pulses & kitchen staples"
                products={getProdsByCategory('staples').length > 0 ? getProdsByCategory('staples') : allProducts.slice(1, 5)}
              />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="dmart-card p-12 text-center space-y-3 rounded-3xl bg-white border border-slate-200">
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
