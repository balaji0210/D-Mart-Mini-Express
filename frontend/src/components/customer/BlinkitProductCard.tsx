import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, RotateCcw, Zap, Plus, Minus, Check } from 'lucide-react';
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

  // Derive weights/variants options
  const defaultUnit = product.weight_size || product.unit || '250 g';
  const [selectedVariant, setSelectedVariant] = useState(defaultUnit);

  const variants = [
    defaultUnit,
    defaultUnit.includes('g') ? '500 g' : defaultUnit.includes('kg') ? '2 kg' : 'Double Pack',
    defaultUnit.includes('g') ? '1 kg' : defaultUnit.includes('kg') ? '5 kg' : 'Family Pack',
  ];

  // Find item in cart
  const cartItem = cart?.items?.find(
    (item: any) =>
      item.product_id === product.id ||
      item.product?.id === product.id ||
      item.id === product.id
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsUpdating(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`Added ${product.name.slice(0, 20)}...`);
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
    (product.discount_price && product.discount_price > product.price
      ? `${Math.round(
          ((product.discount_price - product.price) / product.discount_price) * 100
        )}% OFF`
      : '18% OFF');

  const regularPrice = product.discount_price
    ? product.discount_price
    : Math.round(Number(product.price) * 1.22);

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
        </Link>

        {/* Star Rating Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-800 text-[10px] font-bold shadow-2xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.8</span>
          </span>
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

        {/* Price & Unit Row */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-base sm:text-lg text-slate-900">
              ₹{Number(product.price).toFixed(0)}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{Number(regularPrice).toFixed(0)}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            {selectedVariant}
          </span>
        </div>

        {/* Weight Variant Chips */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-none">
          {variants.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedVariant(v)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                selectedVariant === v
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom ADD Button / Counter */}
      <div>
        {quantity === 0 ? (
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
