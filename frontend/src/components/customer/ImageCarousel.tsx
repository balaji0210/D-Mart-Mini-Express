import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnLink: string;
  bgGradient: string;
  textColor: string;
  subtextColor: string;
  btnStyle: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: '⚡ 10 MINS PICKUP & DELIVERY',
    badgeColor: 'bg-white/20 text-white border-white/40',
    title: 'Farm Fresh Produce & Daily Pantry',
    subtitle: 'Get handpicked organic fruits, crisp farm vegetables, dairy and eggs in minutes.',
    btnText: 'Shop Farm Fresh',
    btnLink: '/products?category=cat-fruits-veg',
    bgGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    textColor: 'text-white',
    subtextColor: 'text-emerald-50',
    btnStyle: 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900',
  },
  {
    id: 2,
    badge: '🎉 MEGA SAVINGS FEST',
    badgeColor: 'bg-white/20 text-white border-white/40',
    title: 'Celebrate with Sweets, Chocolates & Dry Fruits',
    subtitle: 'Flat discounts on Kwality Wall’s ice cream tubs, Kaju Katli, and Cadbury Celebration packs.',
    btnText: 'Explore Sweet Treats',
    btnLink: '/products?category=cat-sweet',
    bgGradient: 'from-rose-500 via-pink-600 to-purple-600',
    textColor: 'text-white',
    subtextColor: 'text-rose-50',
    btnStyle: 'bg-white text-rose-900 hover:bg-rose-50 shadow-lg',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=900',
  },
  {
    id: 3,
    badge: '🥤 CHILLED BEVERAGES & SNACKS',
    badgeColor: 'bg-white/20 text-white border-white/40',
    title: 'Cold Drinks, Ice Cubes & Party Munchies',
    subtitle: 'Diet Coke, Bisleri Water, Sprite Lime, Lay’s Chips & Candies delivered icy cold.',
    btnText: 'Shop Drinks & Chips',
    btnLink: '/products?category=cat-drinks',
    bgGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    textColor: 'text-white',
    subtextColor: 'text-blue-50',
    btnStyle: 'bg-white text-blue-900 hover:bg-blue-50 shadow-lg',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=900',
  },
  {
    id: 4,
    badge: '🥛 DAILY BREAKFAST ESSENTIALS',
    badgeColor: 'bg-white/20 text-white border-white/40',
    title: 'Pure Dairy, Farm Milk & Fresh Breads',
    subtitle: 'Chitale Full Cream Milk, Yojana White Eggs, Amul Curd and bakery items ready at shelf prices.',
    btnText: 'Shop Dairy & Bakery',
    btnLink: '/products?category=cat-dairy',
    bgGradient: 'from-amber-500 via-orange-500 to-amber-600',
    textColor: 'text-white',
    subtextColor: 'text-amber-50',
    btnStyle: 'bg-slate-950 text-white hover:bg-slate-900 shadow-lg',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900',
  },
];

export const ImageCarousel: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[currentIdx];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-all duration-300 select-none group/carousel border border-slate-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active Slide Container */}
      <div
        className={`relative min-h-[220px] sm:min-h-[280px] md:min-h-[300px] flex items-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-500`}
      >
        {/* Right Product Image */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 bg-cover bg-center opacity-90 hidden sm:block transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        {/* Left-to-right soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent"></div>

        {/* Text Content */}
        <div className="relative z-10 max-w-xl p-6 sm:p-10 md:p-12 space-y-3.5">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border backdrop-blur-xs ${slide.badgeColor}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight ${slide.textColor}`}>
            {slide.title}
          </h2>

          <p className={`text-xs sm:text-sm leading-relaxed font-medium line-clamp-2 ${slide.subtextColor}`}>
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              to={slide.btnLink}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${slide.btnStyle}`}
            >
              <span>{slide.btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIdx === idx
                ? 'w-6 h-2 bg-white shadow-xs'
                : 'w-2 h-2 bg-white/60 hover:bg-white/90'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
