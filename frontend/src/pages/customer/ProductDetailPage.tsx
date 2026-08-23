import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Clock, Flame, AlertCircle, Check, Star, RotateCcw } from 'lucide-react';
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
          if (res.success && res.data) {
            setProduct(res.data);
            const baseUnit = res.data.weight_size || res.data.unit || '250 g';
            setSelectedVariant(baseUnit);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="dmart-card p-8 animate-pulse h-96 rounded-3xl"></div>
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

  // Derive variants and dynamic price scaling
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
  const activeVariantObj = variants.find((v) => v.label === selectedVariant) || variants[0];
  const activePrice = Math.max(1, Math.round(basePrice * activeVariantObj.mult));
  const activeRegularPrice = Math.max(activePrice, Math.round(baseRegularPrice * activeVariantObj.mult));

  // Stock status
  const stockQty = product.stock_quantity ?? 50;
  const lowStockThreshold = product.low_stock_threshold || 15;
  const isOutOfStock = stockQty <= 0 || product.is_in_stock === false;
  const isLowStock = !isOutOfStock && (stockQty <= lowStockThreshold || product.is_low_stock);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await addToCart(product.id, quantity);
      if (ok) {
        toast.success(`Added ${quantity}x "${product.name} (${selectedVariant})" to cart!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      <div className="dmart-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-3xl border border-slate-200 shadow-xs bg-white">
        {/* Product Image */}
        <div className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-6 relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full max-h-80 object-contain"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
            }}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <span className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                {typeof product.category === 'object' ? product.category.name : product.category_name || 'Grocery'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8 Rating
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{product.name}</h1>
            <p className="text-slate-600 text-xs leading-relaxed">{product.description}</p>

            {/* Low Stock Alert Banner */}
            {isLowStock && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-600 shrink-0" />
                <span>Urgent: Low Stock Alert! Only {stockQty} units remaining in the store.</span>
              </div>
            )}

            {/* Weight / Pack Size Selector (Dynamic Price Updates) */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Select Pack Size / Weight:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedVariant(v.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedVariant === v.label
                        ? 'bg-emerald-700 text-white shadow-sm scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{v.label}</span>
                    <span className="ml-1.5 opacity-80">(₹{Math.max(1, Math.round(basePrice * v.mult))})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Cart Action */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">₹{activePrice}</span>
              {activeRegularPrice > activePrice && (
                <span className="text-base text-slate-400 line-through">₹{activeRegularPrice}</span>
              )}
              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs">
                  Out of Stock
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs">
                  In Stock ({stockQty} units)
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-700 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-slate-900 font-black text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stockQty, quantity + 1))}
                    className="px-3.5 py-2.5 text-slate-700 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-600/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isSubmitting ? 'Adding...' : 'Add to Shopping Bag'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-500 border-t border-slate-100 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> 10-Minute Express Doorstep Delivery
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" /> 7-Day Hassle-Free Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
