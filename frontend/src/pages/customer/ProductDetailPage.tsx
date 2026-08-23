import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Clock, AlertTriangle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (id) {
      productsApi
        .getProductDetail(id)
        .then((res: any) => {
          if (res.success) setProduct(res.data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      toast.error('Only customers can add items to cart.');
      return;
    }

    if (!product) return;
    setIsSubmitting(true);
    try {
      const ok = await addToCart(product.id, quantity);
      if (ok) {
        toast.success(`Added ${quantity}x "${product.name}" to cart!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="dmart-card p-8 animate-pulse h-96"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/products" className="btn-secondary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      <div className="dmart-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-96">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e';
            }}
          />
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="badge-info">
              {typeof product.category === 'object' ? product.category.name : product.category_name || 'Grocery'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{product.name}</h1>
            <p className="text-slate-600 text-xs leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-teal-800">₹{Number(product.price).toFixed(2)}</span>
              {product.is_in_stock ? (
                <span className="badge-success">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="badge-danger">
                  Out of Stock
                </span>
              )}
            </div>

            {product.is_in_stock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-slate-900 font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-3 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isSubmitting ? 'Adding...' : 'Add to Shopping Cart'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" /> Scheduled Express Pickup
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality Verified Item
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
