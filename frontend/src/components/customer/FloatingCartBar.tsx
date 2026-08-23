import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const FloatingCartBar: React.FC = () => {
  const { cart } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const itemCount = cart.total_items || cart.items.length;
  const subtotal = Number(cart.subtotal || 0);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="pointer-events-auto w-full max-w-xl rounded-3xl bg-[#064e3b] text-white p-3 sm:p-3.5 px-4 sm:px-5 shadow-2xl flex items-center justify-between gap-3 sm:gap-4 border border-emerald-500/40 backdrop-blur-lg">
        {/* Left: Yellow Cart Icon Avatar + Text Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <ShoppingCart className="w-5 h-5 fill-slate-950 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-white">
              <span>{itemCount} {itemCount === 1 ? 'Item' : 'Items'} in Bag</span>
              <span className="text-emerald-400 font-normal">•</span>
              <span className="text-amber-400 font-extrabold">₹{subtotal.toFixed(0)}</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
              <span>Extra savings applied • 10m delivery</span>
            </p>
          </div>
        </div>

        {/* Right: Checkout Yellow Button */}
        <Link
          to="/cart"
          className="shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
