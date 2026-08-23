import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  Store,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const CartPage: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleQtyChange = async (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(itemId);
      return;
    }
    setUpdatingId(itemId);
    try {
      await updateQuantity(itemId, newQty);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update quantity.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed from cart.');
    } catch (err) {
      toast.error('Failed to remove item.');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Shopping cart cleared.');
      setClearModalOpen(false);
    } catch (err) {
      toast.error('Failed to clear cart.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="dmart-card p-8 animate-pulse h-80 rounded-3xl"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-5 rounded-full bg-emerald-50 text-emerald-600 w-24 h-24 mx-auto flex items-center justify-center border border-emerald-200 shadow-xs">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Explore our grocery catalog to add fresh daily items and reserve your express 10-minute pickup or home delivery.
        </p>
        <div className="pt-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(cart.subtotal || 0);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Your Shopping Cart ({cart.total_items} {cart.total_items === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected groceries before checkout
          </p>
        </div>
        <button
          onClick={() => setClearModalOpen(true)}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="dmart-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 shadow-2xs hover:border-slate-300 transition bg-white"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.image_url}
                  alt={item.product?.name}
                  className="w-16 h-16 object-contain rounded-2xl bg-slate-50 border border-slate-200 p-1 shrink-0"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200';
                  }}
                />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {item.product?.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Unit Price: ₹{Number(item.product?.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    disabled={updatingId === item.id}
                    className="p-2 text-slate-700 hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-slate-900 font-extrabold text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    disabled={updatingId === item.id}
                    className="p-2 text-slate-700 hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[5rem]">
                  <span className="text-base font-black text-slate-900">
                    ₹{Number(item.subtotal).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary Card */}
        <aside className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white sticky top-24">
          <h3 className="text-base font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3">
            Cart Summary
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Items Subtotal</span>
              <span className="font-extrabold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Store Pickup Convenience Fee</span>
              <span className="font-extrabold text-emerald-700">FREE</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-black text-slate-900 uppercase tracking-wider">Total Payable</span>
            <span className="text-2xl font-black text-emerald-800">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>

      <ConfirmationModal
        isOpen={clearModalOpen}
        title="Clear Entire Cart?"
        message="Are you sure you want to remove all items from your shopping cart? This cannot be undone."
        confirmText="Clear Cart"
        variant="danger"
        onConfirm={handleClearCart}
        onCancel={() => setClearModalOpen(false)}
      />
    </div>
  );
};
