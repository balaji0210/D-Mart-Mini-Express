import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';
import { CategoryProductRow } from '../../components/customer/CategoryProductRow';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await productsApi.getProducts();
        if (res.success && res.data) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Filter products by category for rows
  const getProdsByCategory = (catKey: string) => {
    return products.filter((p: any) => {
      if (typeof p.category === 'string') {
        return p.category === catKey || p.category.includes(catKey);
      }
      return (
        p.category?.id === catKey ||
        p.category?.slug === catKey ||
        p.category?.slug?.includes(catKey)
      );
    });
  };

  const coldDrinks = getProdsByCategory('drinks');
  const candiesGums = getProdsByCategory('candies');
  const dairyBreadEggs = getProdsByCategory('dairy');
  const rollingPaper = getProdsByCategory('tobacco');
  const snacksMunchies = getProdsByCategory('snacks');
  const fruitsVeg = getProdsByCategory('fruits');

  // 10 Category Icons (Screenshot 4)
  const categoryIcons = [
    { name: 'Paan Corner', icon: '🚬', slug: 'cat-tobacco', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=160' },
    { name: 'Dairy, Bread & Eggs', icon: '🥛', slug: 'cat-dairy', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=160' },
    { name: 'Fruits & Vegetables', icon: '🥦', slug: 'cat-fruits-veg', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=160' },
    { name: 'Cold Drinks & Juices', icon: '🥤', slug: 'cat-drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160' },
    { name: 'Snacks & Munchies', icon: '🍟', slug: 'cat-snacks', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=160' },
    { name: 'Breakfast & Instant Food', icon: '🥣', slug: 'cat-breakfast', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160' },
    { name: 'Sweet Tooth', icon: '🍫', slug: 'cat-sweet', img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=160' },
    { name: 'Bakery & Biscuits', icon: '🍞', slug: 'cat-bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160' },
    { name: 'Tea, Coffee & Milk Drinks', icon: '☕', slug: 'cat-tea-coffee', img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=160' },
    { name: 'Atta, Rice & Dal', icon: '🌾', slug: 'cat-staples', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160' },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* 1. TOP HERO BANNER (Matching Screenshot 4) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-700 text-white shadow-xl min-h-[220px] sm:min-h-[260px] flex items-center">
        {/* Background Image of Fresh Produce */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 bg-cover bg-center opacity-85 mix-blend-luminosity hidden sm:block"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-transparent"></div>

        <div className="relative z-10 max-w-xl p-6 sm:p-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" /> 12 MIN EXPRESS DELIVERY & STORE PICKUP
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-snug">
            Stock up on daily essentials
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Get farm-fresh goodness & a range of exotic fruits, vegetables, dairy, eggs & more delivered in minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs sm:text-sm hover:bg-emerald-50 shadow-lg transition-all active:scale-95"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THREE PROMOTIONAL FEATURE CARDS (Matching Screenshot 4) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pharmacy Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md flex flex-col justify-between min-h-[160px] group">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight">
              Pharmacy at your doorstep!
            </h3>
            <p className="text-[11px] text-teal-100 font-medium">
              Cough syrups, pain relief sprays & more
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-pharmacy"
              className="inline-block px-4 py-2 rounded-xl bg-white text-teal-900 font-extrabold text-xs hover:bg-teal-50 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-25 select-none pointer-events-none group-hover:scale-110 transition-transform">
            💊
          </span>
        </div>

        {/* Pet Care Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-md flex flex-col justify-between min-h-[160px] group">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight text-slate-900">
              Pet care supplies at your door
            </h3>
            <p className="text-[11px] text-slate-800 font-semibold">
              Food, treats, toys & more
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-pet"
              className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-25 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🐶
          </span>
        </div>

        {/* Baby Care Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-300 via-blue-200 to-slate-400 text-slate-900 shadow-md flex flex-col justify-between min-h-[160px] group">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight text-slate-900">
              No time for a diaper run?
            </h3>
            <p className="text-[11px] text-slate-700 font-semibold">
              Get baby care essentials in minutes
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-baby"
              className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-25 select-none pointer-events-none group-hover:scale-110 transition-transform">
            👶
          </span>
        </div>
      </section>

      {/* 3. CATEGORY ICONS GRID (Matching Screenshot 4 Bottom Row) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Explore by Category</h2>
          <Link to="/products" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
          {categoryIcons.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center text-center p-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center p-1 mb-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CATEGORY PRODUCT ROWS WITH HORIZONTAL SLIDERS (Matching Screenshots 2 & 3) */}
      <section className="space-y-10">
        {/* Cold Drinks & Juices */}
        <CategoryProductRow
          title="Cold Drinks & Juices"
          categoryId="cat-drinks"
          products={coldDrinks.length > 0 ? coldDrinks : products.slice(0, 6)}
        />

        {/* Candies & Gums */}
        <CategoryProductRow
          title="Candies & Gums"
          categoryId="cat-candies"
          products={candiesGums.length > 0 ? candiesGums : products.slice(2, 8)}
        />

        {/* Dairy, Bread & Eggs */}
        <CategoryProductRow
          title="Dairy, Bread & Eggs"
          categoryId="cat-dairy"
          products={dairyBreadEggs.length > 0 ? dairyBreadEggs : products.slice(1, 7)}
        />

        {/* Rolling paper & tobacco */}
        <CategoryProductRow
          title="Rolling paper & tobacco"
          categoryId="cat-tobacco"
          products={rollingPaper.length > 0 ? rollingPaper : products.slice(3, 9)}
        />

        {/* Snacks & Munchies */}
        <CategoryProductRow
          title="Snacks & Munchies"
          categoryId="cat-snacks"
          products={snacksMunchies.length > 0 ? snacksMunchies : products.slice(0, 5)}
        />

        {/* Fruits & Vegetables */}
        <CategoryProductRow
          title="Fruits & Vegetables"
          categoryId="cat-fruits-veg"
          products={fruitsVeg.length > 0 ? fruitsVeg : products.slice(2, 6)}
        />
      </section>
    </div>
  );
};
