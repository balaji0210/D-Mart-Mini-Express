import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';
import { CategoryProductRow } from '../../components/customer/CategoryProductRow';
import { ImageCarousel } from '../../components/customer/ImageCarousel';

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

  const breakfastProds = getProdsByCategory('breakfast');
  const cookingProds = getProdsByCategory('cooking');
  const dairyBreadEggs = getProdsByCategory('dairy');
  const coldDrinks = getProdsByCategory('drinks');
  const snacksMunchies = getProdsByCategory('snacks');
  const fruitsVeg = getProdsByCategory('fruits');
  const sweetTooth = getProdsByCategory('sweet');
  const bakeryProds = getProdsByCategory('bakery');
  const teaCoffee = getProdsByCategory('tea');
  const staples = getProdsByCategory('staples');

  // 10 Category Icons Bar
  const categoryIcons = [
    { name: 'Breakfast & Cereals', icon: '🥣', slug: 'cat-breakfast' },
    { name: 'Cooking Essentials', icon: '🍳', slug: 'cat-cooking' },
    { name: 'Dairy, Bread & Eggs', icon: '🥛', slug: 'cat-dairy' },
    { name: 'Cold Drinks & Juices', icon: '🥤', slug: 'cat-drinks' },
    { name: 'Snacks & Munchies', icon: '🍟', slug: 'cat-snacks' },
    { name: 'Fruits & Vegetables', icon: '🥦', slug: 'cat-fruits-veg' },
    { name: 'Sweet Tooth', icon: '🍫', slug: 'cat-sweet' },
    { name: 'Bakery & Biscuits', icon: '🍞', slug: 'cat-bakery' },
    { name: 'Tea & Coffee', icon: '☕', slug: 'cat-tea-coffee' },
    { name: 'Atta, Rice & Dal', icon: '🌾', slug: 'cat-staples' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* 1. TOP PROMOTIONAL AUTO-SLIDING CAROUSEL */}
      <section className="w-full">
        <ImageCarousel />
      </section>

      {/* 2. POPULAR CATEGORIES QUICK PILLS NAVIGATION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Popular Categories
          </h3>
          <Link
            to="/products"
            className="text-xs text-emerald-700 hover:text-emerald-800 font-extrabold hover:underline"
          >
            Explore all aisles →
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
          {categoryIcons.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center justify-center p-3 rounded-2xl min-w-[95px] sm:min-w-[105px] shrink-0 bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-slate-700 text-center leading-tight group-hover:text-emerald-800">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY-WISE PRODUCT SECTIONS (MATCHING REFERENCE IMAGE) */}
      <section className="space-y-6">
        {/* Breakfast & Cereals */}
        <CategoryProductRow
          title="Breakfast & Cereals"
          categoryId="cat-breakfast"
          categorySlug="breakfast-cereals"
          icon="🥣"
          subtitle="Fresh stock ready for 10-minute doorstep delivery"
          products={breakfastProds.length > 0 ? breakfastProds : products.slice(0, 4)}
        />

        {/* Cooking Essentials */}
        <CategoryProductRow
          title="Cooking Essentials"
          categoryId="cat-cooking"
          categorySlug="cooking-essentials"
          icon="🍳"
          subtitle="Fresh stock ready for 10-minute doorstep delivery"
          products={cookingProds.length > 0 ? cookingProds : products.slice(0, 3)}
        />

        {/* Dairy, Bread & Eggs */}
        <CategoryProductRow
          title="Dairy, Bread & Eggs"
          categoryId="cat-dairy"
          categorySlug="dairy-bakery"
          icon="🥛"
          subtitle="Farm fresh milk, curd, eggs and breakfast essentials"
          products={dairyBreadEggs.length > 0 ? dairyBreadEggs : products.slice(2, 8)}
        />

        {/* Cold Drinks & Juices */}
        <CategoryProductRow
          title="Cold Drinks & Juices"
          categoryId="cat-drinks"
          categorySlug="cold-drinks-juices"
          icon="🥤"
          subtitle="Icy cold sodas, fruit juices & instant hydration"
          products={coldDrinks.length > 0 ? coldDrinks : products.slice(4, 10)}
        />

        {/* Snacks & Munchies */}
        <CategoryProductRow
          title="Snacks & Munchies"
          categoryId="cat-snacks"
          categorySlug="snacks-munchies"
          icon="🍟"
          subtitle="Crispy chips, roasted nuts & party munchies"
          products={snacksMunchies.length > 0 ? snacksMunchies : products.slice(0, 6)}
        />

        {/* Fruits & Vegetables */}
        <CategoryProductRow
          title="Fruits & Vegetables"
          categoryId="cat-fruits-veg"
          categorySlug="fruits-vegetables"
          icon="🥦"
          subtitle="Handpicked farm fresh vegetables & organic fruits"
          products={fruitsVeg.length > 0 ? fruitsVeg : products.slice(3, 7)}
        />

        {/* Sweet Tooth & Desserts */}
        <CategoryProductRow
          title="Sweet Tooth & Desserts"
          categoryId="cat-sweet"
          categorySlug="sweet-tooth"
          icon="🍫"
          subtitle="Ice cream tubs, festive sweets & chocolates"
          products={sweetTooth.length > 0 ? sweetTooth : products.slice(1, 7)}
        />

        {/* Bakery & Biscuits */}
        <CategoryProductRow
          title="Bakery & Biscuits"
          categoryId="cat-bakery"
          categorySlug="bakery-biscuits"
          icon="🍞"
          subtitle="Oven fresh breads, crunchy cookies & rusks"
          products={bakeryProds.length > 0 ? bakeryProds : products.slice(2, 6)}
        />

        {/* Tea, Coffee & Milk Drinks */}
        <CategoryProductRow
          title="Tea, Coffee & Drinks"
          categoryId="cat-tea-coffee"
          categorySlug="tea-coffee-milk-drinks"
          icon="☕"
          subtitle="Aromatic chai leaves, roast coffee & health mixes"
          products={teaCoffee.length > 0 ? teaCoffee : products.slice(0, 4)}
        />

        {/* Atta, Rice & Dal */}
        <CategoryProductRow
          title="Atta, Rice & Dal"
          categoryId="cat-staples"
          categorySlug="atta-rice-dal"
          icon="🌾"
          subtitle="Premium grains, unpolished pulses & kitchen staples"
          products={staples.length > 0 ? staples : products.slice(1, 5)}
        />
      </section>
    </div>
  );
};
