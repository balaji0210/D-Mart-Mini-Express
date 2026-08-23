import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { BlinkitProductCard } from './BlinkitProductCard';

interface CategoryProductRowProps {
  title: string;
  categorySlug?: string;
  categoryId?: string;
  icon?: string;
  subtitle?: string;
  products: Product[];
}

export const CategoryProductRow: React.FC<CategoryProductRowProps> = ({
  title,
  categorySlug,
  categoryId,
  icon = '🥣',
  subtitle = 'Fresh stock ready for 10-minute doorstep delivery',
  products,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const targetLink = categoryId
    ? `/products?category=${categoryId}`
    : categorySlug
    ? `/products?category=${categorySlug}`
    : '/products';

  return (
    <div className="space-y-4 p-4 sm:p-6 rounded-3xl border border-slate-200/90 bg-white shadow-2xs relative group/row">
      {/* Category Section Header matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-2xs">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                {products.length} items
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* View All in Category Link */}
        <Link
          to={targetLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition self-start sm:self-auto cursor-pointer"
        >
          <span>View All in {title}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all opacity-0 group-hover/row:opacity-100 hidden sm:flex cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Products List */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((prod) => (
            <BlinkitProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all opacity-90 group-hover/row:opacity-100 flex cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
