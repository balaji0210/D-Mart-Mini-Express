import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, RotateCcw, Zap, Plus, Minus, AlertCircle, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface BlinkitProductCardProps {
  product: Product;
  discountBadge?: string;
  deliveryTime?: string;
}

export const BlinkitProductCard: React.FC<BlinkitProductCardProps> = ({
  product,
  discountBadge,
  deliveryTime = '10 MINS',
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Derive weights/variants options with dynamic price scaling
  const baseWeight = product.weight_size || product.unit || '250 g';
  const basePrice = Number(product.price);
  const baseRegularPrice = product.discount_price
    ? Number(product.discount_price)
    : Math.round(basePrice * 1.22);

  const getVariants = (base: string) => {
    if (
      base.includes('250 g') ||
      base.includes('200 g') ||
      base.includes('150 g') ||
      base.includes('120 g') ||
      base.includes('100 g') ||
      base.includes('50 g') ||
      base.includes('22 g') ||
      base.includes('56 g') ||
      base.includes('85 g')
    ) {
      return [
        { label: base, mult: 1.0 },
        { label: '500 g', mult: 1.9 },
        { label: '1 kg', mult: 3.6 },
      ];
    } else if (base.includes('400 g') || base.includes('300 g') || base.includes('375 g')) {
      return [
        { label: base, mult: 1.0 },
        { label: '700 g', mult: 1.7 },
        { label: '1 kg', mult: 2.3 },
      ];
    } else if (
      base.includes('1 kg') ||
      base.includes('1 L') ||
      base.includes('1 ltr') ||
      base.includes('750 ml') ||
      base.includes('700 ml')
    ) {
      return [
        { label: base, mult: 1.0 },
        { label: base.includes('L') || base.includes('ltr') || base.includes('ml') ? '2 L' : '2 kg', mult: 1.9 },
        { label: base.includes('L') || base.includes('ltr') || base.includes('ml') ? '5 L' : '5 kg', mult: 4.6 },
      ];
    } else if (base.includes('5 kg')) {
      return [
        { label: '1 kg', mult: 0.22 },
        { label: '5 kg', mult: 1.0 },
        { label: '10 kg', mult: 1.9 },
      ];
    } else if (base.includes('pcs') || base.includes('sachets') || base.includes('wipes')) {
      return [
        { label: base, mult: 1.0 },
        { label: 'Pack of 2', mult: 1.9 },
        { label: 'Pack of 4', mult: 3.7 },
      ];
    }
    return [
      { label: base, mult: 1.0 },
      { label: 'Double Pack', mult: 1.9 },
      { label: 'Family Pack', mult: 3.6 },
    ];
  };

  const variants = getVariants(baseWeight);
  const [selectedVariant, setSelectedVariant] = useState(variants[0].label);

  const activeVariantObj = variants.find((v) => v.label === selectedVariant) || variants[0];
  const activePrice = Math.max(1, Math.round(basePrice * activeVariantObj.mult));
  const activeRegularPrice = Math.max(activePrice, Math.round(baseRegularPrice * activeVariantObj.mult));

  // Find item in cart
  const cartItem = cart?.items?.find(
    (item: any) =>
      item.product_id === product.id ||
      item.product?.id === product.id ||
      item.id === product.id
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  // Stock status checks
  const stockQty = product.stock_quantity ?? 50;
  const lowStockThreshold = product.low_stock_threshold || 15;
  const isOutOfStock = stockQty <= 0 || product.is_in_stock === false;
  const isLowStock = !isOutOfStock && (stockQty <= lowStockThreshold || product.is_low_stock);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('This item is currently out of stock.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsUpdating(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`Added ${product.name.slice(0, 18)} (${selectedVariant})`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    if (quantity >= stockQty) {
      toast.error(`Only ${stockQty} units available in stock.`);
      return;
    }
    setIsUpdating(true);
    try {
      await updateQuantity(cartItem.id, quantity + 1);
    } catch (err) {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    setIsUpdating(true);
    try {
      if (quantity <= 1) {
        await removeItem(cartItem.id);
      } else {
        await updateQuantity(cartItem.id, quantity - 1);
      }
    } catch (err) {
    } finally {
      setIsUpdating(false);
    }
  };

  // Derive discount if applicable
  const displayDiscount =
    discountBadge ||
    (activeRegularPrice > activePrice
      ? `${Math.round(((activeRegularPrice - activePrice) / activeRegularPrice) * 100)}% OFF`
      : '18% OFF');

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category || 'GROCERY';

  return (
    <div className="w-[195px] sm:w-[220px] shrink-0 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group relative">
      <div>
        {/* Top Badge Row (Discount % OFF + ⚡ 10 MINS) */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shadow-2xs">
            {displayDiscount}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[10px] flex items-center gap-0.5 shadow-2xs">
            <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {deliveryTime}
          </span>
        </div>

        {/* Centered Image Container */}
        <Link
          to={`/products/${product.id}`}
          className="block relative h-36 w-full rounded-2xl bg-slate-50/50 flex items-center justify-center p-2 mb-2 overflow-hidden"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300';
            }}
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 text-center rounded-2xl">
              <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Star Rating Badge + Low Stock Alert Indicator */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-800 text-[10px] font-bold shadow-2xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.8</span>
          </span>

          {isLowStock && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[9px] font-black animate-pulse">
              <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
              <span>Only {stockQty} left!</span>
            </span>
          )}
        </div>

        {/* Category Tag & 7d Return Row */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-black text-[9px] uppercase tracking-wider truncate max-w-[100px]">
            {categoryName.slice(0, 11)}...
          </span>
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 shrink-0">
            <RotateCcw className="w-2.5 h-2.5 text-slate-400" /> 7d return
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug mb-2 min-h-[34px] group-hover:text-emerald-700 transition-colors block"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Dynamic Price & Unit Row based on selected weight variant */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-base sm:text-lg text-slate-900">
              ₹{activePrice}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{activeRegularPrice}
            </span>
          </div>
          <span className="text-xs text-emerald-800 font-extrabold">
            {selectedVariant}
          </span>
        </div>

        {/* Selectable Weight Variant Chips (Dynamic Price Changes on Click) */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-none">
          {variants.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedVariant(v.label)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                selectedVariant === v.label
                  ? 'bg-emerald-700 text-white shadow-2xs scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={`Switch to ${v.label} (₹${Math.max(1, Math.round(basePrice * v.mult))})`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom ADD Button / Counter */}
      <div>
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-extrabold text-xs tracking-wider uppercase cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : quantity === 0 ? (
          <button
            onClick={handleAdd}
            disabled={isUpdating}
            className="w-full py-2.5 rounded-xl border border-emerald-400 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white text-emerald-800 font-extrabold text-xs tracking-wider uppercase transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> ADD TO CART
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-emerald-600 text-white px-3 py-2 font-bold text-xs shadow-md">
            <button
              onClick={handleDecrease}
              disabled={isUpdating}
              className="hover:opacity-80 p-0.5 font-extrabold text-sm active:scale-90 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="min-w-[18px] text-center font-black text-sm">{quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={isUpdating}
              className="hover:opacity-80 p-0.5 font-extrabold text-sm active:scale-90 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
