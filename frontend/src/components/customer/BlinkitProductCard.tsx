import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
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
      : undefined);

  return (
    <div className="w-[175px] sm:w-[195px] shrink-0 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 group relative">
      <div>
        {/* Image Container with Discount Badge */}
        <Link to={`/products/${product.id}`} className="block relative h-36 w-full rounded-xl bg-white flex items-center justify-center p-2 mb-2 overflow-hidden">
          {displayDiscount && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-xs z-10">
              {displayDiscount}
            </span>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300';
            }}
          />
        </Link>

        {/* Delivery Time Badge */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
          <Clock className="w-3 h-3 text-cyan-600" />
          <span className="text-slate-800">{deliveryTime}</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-1 min-h-[30px] group-hover:text-blue-700 transition-colors block"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Unit / Weight */}
        <p className="text-[11px] text-slate-500 font-medium mb-3">
          {product.weight_size || product.unit || '1 unit'}
        </p>
      </div>

      {/* Bottom Price & ADD Button */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
        <div className="flex flex-col">
          <span className="font-extrabold text-sm text-slate-900">
            ₹{Number(product.price).toFixed(0)}
          </span>
          {product.discount_price && (
            <span className="text-[10px] text-slate-400 line-through -mt-0.5">
              ₹{Number(product.discount_price).toFixed(0)}
            </span>
          )}
        </div>

        <div>
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isUpdating}
              className="px-3.5 py-1.5 rounded-lg border border-blue-600 bg-white text-blue-700 font-extrabold text-xs tracking-wider uppercase hover:bg-blue-600 hover:text-white transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 gap-2 font-bold text-xs shadow-xs">
              <button
                onClick={handleDecrease}
                disabled={isUpdating}
                className="hover:opacity-80 p-0.5 font-extrabold text-sm active:scale-90"
              >
                -
              </button>
              <span className="min-w-[14px] text-center font-extrabold">{quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={isUpdating}
                className="hover:opacity-80 p-0.5 font-extrabold text-sm active:scale-90"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
