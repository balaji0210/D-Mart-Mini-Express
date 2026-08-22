import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, CalendarClock, ShieldCheck, ArrowRight, Sparkles, Tag, CheckCircle2, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const featuredCategories = [
    { title: 'Fresh Produce', desc: 'Organic Fruits & Vegetables', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', link: '/products?category=produce' },
    { title: 'Dairy & Eggs', desc: 'Farm Fresh Milk, Butter & Cheese', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', link: '/products?category=dairy' },
    { title: 'Bakery & Snacks', desc: 'Freshly Baked Breads & Munchies', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', link: '/products?category=bakery' },
    { title: 'Beverages', desc: 'Juices, Teas, Coffees & Sodas', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', link: '/products?category=beverages' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-800 shadow-xl">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-4 h-4 text-teal-400" /> Mini D-Mart Express Grocery & Pickup
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-50">
            Fresh Grocery Express with <span className="text-teal-400">Scheduled 30-Min Pickup</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Shop premium groceries, farm-fresh produce, and daily pantry staples. Reserve guaranteed store pickup slots or order express delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/products" className="btn-primary py-3.5 px-6 text-sm shadow-lg shadow-teal-500/20">
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products?offers=true" className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 font-semibold rounded-xl text-sm transition-all flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Daily Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Featured Categories</h2>
            <p className="text-slate-500 text-xs mt-0.5">Handpicked premium grocery items for your daily essentials</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((cat, idx) => (
            <Link key={idx} to={cat.link} className="dmart-card p-4 dmart-card-hover group flex flex-col justify-between">
              <div className="overflow-hidden rounded-xl h-36 mb-3 bg-slate-100">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">{cat.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Store Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dmart-card p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-800 shrink-0">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">30-Min Express Pickup</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Book a guaranteed store pickup slot. Zero waiting in line with capacity control.
            </p>
          </div>
        </div>

        <div className="dmart-card p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Freshness Guaranteed</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              100% farm-fresh produce sourced daily with strict quality assurance standards.
            </p>
          </div>
        </div>

        <div className="dmart-card p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Zero Convenience Fee</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No hidden service charges on pickup orders. Pay the exact shelf prices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
