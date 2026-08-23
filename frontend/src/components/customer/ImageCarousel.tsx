import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Zap } from 'lucide-react';

interface Slide {
  id: number;
  tagCategory: { icon: string; text: string };
  tagOffer: { icon: string; text: string };
  tagUrgency: { icon: string; text: string };
  title: string;
  subtitle: string;
  btnText: string;
  btnLink: string;
  bgGradient: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tagCategory: { icon: '🍿', text: 'PARTY MUNCHIES' },
    tagOffer: { icon: '⚡', text: 'BUY 2 GET 1 FREE' },
    tagUrgency: { icon: '🕒', text: 'Ends today' },
    title: 'Crispy Chips, Sodas & Game Night Munchies',
    subtitle: 'Lay’s Magic Masala 3-Pack, Sprite Lime, Diet Coke & Tangy Candies delivered icy cold.',
    btnText: 'Grab Munchies Deal',
    btnLink: '/products?category=cat-snacks',
    bgGradient: 'from-[#2e1065] via-[#3b0764] to-[#581c87]',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=900',
  },
  {
    id: 2,
    tagCategory: { icon: '🥦', text: 'FARM FRESH' },
    tagOffer: { icon: '🏷️', text: 'FLAT 25% OFF' },
    tagUrgency: { icon: '🕒', text: 'Morning Harvest' },
    title: 'Organic Fruits & Crisp Farm Vegetables',
    subtitle: 'Crisp Shimla apples, Robusta bananas, fresh Nashik red onions and farm eggs in 10 mins.',
    btnText: 'Shop Fresh Produce',
    btnLink: '/products?category=cat-fruits-veg',
    bgGradient: 'from-[#064e3b] via-[#047857] to-[#0d9488]',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900',
  },
  {
    id: 3,
    tagCategory: { icon: '🍫', text: 'SWEET TOOTH' },
    tagOffer: { icon: '🎁', text: 'UP TO 40% OFF' },
    tagUrgency: { icon: '🕒', text: 'Limited Stock' },
    title: 'Kwality Ice Cream Tubs, Kaju Katli & Sweets',
    subtitle: 'Alphonso Mango & Choco Brownie 700ml tubs, Cadbury hampers and festive sweets at discounted prices.',
    btnText: 'Explore Sweet Treats',
    btnLink: '/products?category=cat-sweet',
    bgGradient: 'from-[#701a75] via-[#86198f] to-[#be185d]',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=900',
  },
  {
    id: 4,
    tagCategory: { icon: '🥛', text: 'DAILY ESSENTIALS' },
    tagOffer: { icon: '⚡', text: 'COMBO SAVER' },
    tagUrgency: { icon: '🕒', text: 'Daily Morning Deal' },
    title: 'Pure Dairy, Farm Milk & Fresh Breads',
    subtitle: 'Chitale Full Cream Milk, Yojana White Eggs, Amul Curd & Fresh Butter at guaranteed shelf rates.',
    btnText: 'Shop Dairy & Bakery',
    btnLink: '/products?category=cat-dairy',
    bgGradient: 'from-[#1e3a8a] via-[#1d4ed8] to-[#0284c7]',
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
      className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-all duration-300 select-none group/carousel border border-slate-700/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active Slide Container */}
      <div
        className={`relative min-h-[230px] sm:min-h-[280px] md:min-h-[300px] flex items-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-500`}
      >
        {/* Right Product Image with soft gradient blending */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 bg-cover bg-center opacity-90 hidden sm:block transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        {/* Left-to-right fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"></div>

        {/* Text Content */}
        <div className="relative z-10 max-w-xl p-6 sm:p-10 md:p-12 space-y-4">
          
          {/* EXACT MULTI-TAG OFFER STRIP MATCHING SCREENSHOT */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Tag 1: Category Pill (Glassmorphic border with yellow text) */}
            <div className="px-3.5 py-1 rounded-full bg-white/15 border border-white/30 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-xs">
              <span className="text-sm">{slide.tagCategory.icon}</span>
              <span>{slide.tagCategory.text}</span>
            </div>

            {/* Tag 2: Offer Pill (Solid golden amber pill with bold text) */}
            <div className="px-3.5 py-1 rounded-full bg-[#d97706] text-amber-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span>{slide.tagOffer.icon}</span>
              <span>{slide.tagOffer.text}</span>
            </div>

            {/* Tag 3: Urgency Pill (Rounded pill with clock icon) */}
            <div className="px-3 py-1 rounded-full bg-black/30 border border-white/20 text-amber-200 font-bold text-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.tagUrgency.text}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium line-clamp-2">
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              to={slide.btnLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
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
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-600/80 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-600/80 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIdx === idx
                ? 'w-6 h-2 bg-amber-400 shadow-xs'
                : 'w-2 h-2 bg-slate-500 hover:bg-slate-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
