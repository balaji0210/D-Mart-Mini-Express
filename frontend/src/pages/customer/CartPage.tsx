import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShoppingCart, Plus, Minus, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const CartPage: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleQtyChange = async (itemId: string, newQty: number) => {
    if (newQty <= 0) return;
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
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-teal-100 text-teal-700 w-20 h-20 mx-auto flex items-center justify-center border border-teal-200 shadow-sm">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Explore our grocery catalog to add fresh items and reserve your express store pickup slot.
        </p>
        <div className="pt-2">
          <Link to="/products" className="btn-primary">
            Browse Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(cart.subtotal || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Your Shopping Cart ({cart.total_items} items)</h1>
        <button
          onClick={() => setClearModalOpen(true)}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="dmart-card p-4 sm:p-5 flex items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.image_url}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
                  }}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.product?.name}</h4>
                  <p className="text-xs text-slate-500">Unit Price: ₹{Number(item.product?.price).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    disabled={updatingId === item.id}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-slate-900 font-bold text-xs">{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    disabled={updatingId === item.id}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[5rem]">
                  <span className="text-base font-extrabold text-teal-800">
                    ₹{Number(item.subtotal).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="dmart-card p-6 space-y-6 h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Cart Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Store Pickup Convenience Fee</span>
              <span className="font-semibold text-teal-700">FREE</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-lg text-teal-800">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary w-full py-3.5 text-sm"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={clearModalOpen}
        title="Clear Shopping Cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmText="Clear Cart"
        variant="danger"
        onConfirm={handleClearCart}
        onCancel={() => setClearModalOpen(false)}
      />
    </div>
  );
};
