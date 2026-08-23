import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '../../types/product';
import { BlinkitProductCard } from './BlinkitProductCard';

interface CategoryProductRowProps {
  title: string;
  categorySlug?: string;
  categoryId?: string;
  products: Product[];
}

export const CategoryProductRow: React.FC<CategoryProductRowProps> = ({
  title,
  categorySlug,
  categoryId,
  products,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const targetLink = categoryId
    ? `/products?category=${categoryId}`
    : categorySlug
    ? `/products?category=${categorySlug}`
    : '/products';

  return (
    <div className="space-y-3 relative group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        <Link
          to={targetLink}
          className="text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors lowercase flex items-center gap-0.5"
        >
          see all
        </Link>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all opacity-0 group-hover/row:opacity-100 hidden sm:flex cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Products List */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((prod) => (
            <BlinkitProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all opacity-90 group-hover/row:opacity-100 flex cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
