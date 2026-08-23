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

  // 10 Category Icons
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
    <div className="space-y-10 pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* 1. TOP HERO BANNER (ROYAL SAPPHIRE & MIDNIGHT INDIGO PALETTE) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white shadow-xl min-h-[220px] sm:min-h-[260px] flex items-center border border-slate-700/50">
        {/* Background Image of Fresh Produce */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 bg-cover bg-center opacity-80 mix-blend-luminosity hidden sm:block"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b] via-[#0b132b]/95 to-transparent"></div>

        <div className="relative z-10 max-w-xl p-6 sm:p-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 10 MIN EXPRESS DELIVERY & STORE PICKUP
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-snug">
            Stock up on daily essentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Get farm-fresh goodness & a wide range of exotic fruits, vegetables, dairy, snacks & more delivered in minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THREE PROMOTIONAL FEATURE CARDS (ROYAL MULTI-COLOR ACCENTS) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pharmacy Card (Deep Indigo & Violet) */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white shadow-md flex flex-col justify-between min-h-[160px] group border border-indigo-500/30">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight">
              Pharmacy at your doorstep!
            </h3>
            <p className="text-[11px] text-indigo-200 font-medium">
              Cough syrups, pain relief sprays & more
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-pharmacy"
              className="inline-block px-4 py-2 rounded-xl bg-white text-indigo-950 font-extrabold text-xs hover:bg-slate-100 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform">
            💊
          </span>
        </div>

        {/* Pet Care Card (Warm Amber & Tangerine) */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md flex flex-col justify-between min-h-[160px] group border border-amber-400/40">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight text-slate-950">
              Pet care supplies at your door
            </h3>
            <p className="text-[11px] text-slate-900 font-bold">
              Food, treats, toys & more
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-pet"
              className="inline-block px-4 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs hover:bg-slate-900 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🐶
          </span>
        </div>

        {/* Baby Care Card (Deep Sapphire Cyan) */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-900 text-white shadow-md flex flex-col justify-between min-h-[160px] group border border-cyan-500/30">
          <div className="space-y-1 z-10 max-w-[210px]">
            <h3 className="text-lg font-black tracking-tight leading-tight">
              No time for a diaper run?
            </h3>
            <p className="text-[11px] text-cyan-200 font-medium">
              Get baby care essentials in minutes
            </p>
          </div>
          <div className="pt-4 z-10">
            <Link
              to="/products?category=cat-baby"
              className="inline-block px-4 py-2 rounded-xl bg-white text-blue-950 font-extrabold text-xs hover:bg-slate-100 shadow-sm transition"
            >
              Order Now
            </Link>
          </div>
          <span className="absolute -right-2 -bottom-2 text-7xl opacity-20 select-none pointer-events-none group-hover:scale-110 transition-transform">
            👶
          </span>
        </div>
      </section>

      {/* 3. CATEGORY ICONS GRID */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Explore by Category</h2>
          <Link to="/products" className="text-xs font-bold text-blue-700 hover:text-blue-800">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
          {categoryIcons.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center text-center p-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center p-1 mb-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CATEGORY PRODUCT ROWS WITH HORIZONTAL SLIDERS */}
      <section className="space-y-8">
        {/* Breakfast & Cereals */}
        <CategoryProductRow
          title="Breakfast & Cereals"
          categoryId="cat-breakfast"
          icon="🥣"
          subtitle="Fresh stock ready for 10-minute doorstep delivery"
          products={getProdsByCategory('breakfast').length > 0 ? getProdsByCategory('breakfast') : products.slice(0, 5)}
        />

        {/* Cold Drinks & Juices */}
        <CategoryProductRow
          title="Cold Drinks & Juices"
          categoryId="cat-drinks"
          icon="🥤"
          subtitle="Icy cold sodas, fruit juices & instant hydration"
          products={coldDrinks.length > 0 ? coldDrinks : products.slice(0, 6)}
        />

        {/* Dairy, Bread & Eggs */}
        <CategoryProductRow
          title="Dairy, Bread & Eggs"
          categoryId="cat-dairy"
          icon="🥛"
          subtitle="Farm fresh milk, curd, eggs and breakfast essentials"
          products={dairyBreadEggs.length > 0 ? dairyBreadEggs : products.slice(1, 7)}
        />

        {/* Snacks & Munchies */}
        <CategoryProductRow
          title="Snacks & Munchies"
          categoryId="cat-snacks"
          icon="🍟"
          subtitle="Crispy chips, roasted nuts & party munchies"
          products={snacksMunchies.length > 0 ? snacksMunchies : products.slice(0, 5)}
        />

        {/* Fruits & Vegetables */}
        <CategoryProductRow
          title="Fruits & Vegetables"
          categoryId="cat-fruits-veg"
          icon="🥦"
          subtitle="Handpicked farm fresh vegetables & organic fruits"
          products={fruitsVeg.length > 0 ? fruitsVeg : products.slice(2, 6)}
        />

        {/* Candies & Sweet Tooth */}
        <CategoryProductRow
          title="Sweet Tooth & Desserts"
          categoryId="cat-sweet"
          icon="🍫"
          subtitle="Ice cream tubs, festive sweets & chocolates"
          products={candiesGums.length > 0 ? candiesGums : products.slice(2, 8)}
        />
      </section>
    </div>
  );
};
