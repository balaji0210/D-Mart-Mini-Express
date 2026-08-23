import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Store,
  MapPin,
  Tag,
  Check,
  CreditCard,
  QrCode,
  Zap,
  Banknote,
  Building,
  Sparkles,
  ShoppingBag,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders';
import { FulfillmentType, PaymentMethod } from '../../types/order';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface Coupon {
  code: string;
  tag: string;
  tagColor: string;
  title: string;
  subtext: string;
  minOrder: number;
  discountType: 'flat' | 'percentage' | 'delivery';
  discountValue: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'RAKHI50',
    tag: 'FESTIVE SPECIAL',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    title: '🪢 Rakhi Festive Special',
    subtext: 'Flat ₹50 OFF on orders above ₹199',
    minOrder: 199,
    discountType: 'flat',
    discountValue: 50,
  },
  {
    code: 'FREESHIP',
    tag: 'POPULAR',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: '⚡ Free Express Delivery',
    subtext: '100% Free delivery on orders above ₹149',
    minOrder: 149,
    discountType: 'delivery',
    discountValue: 40,
  },
  {
    code: 'WELCOME100',
    tag: 'MEGA SAVER',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: '🎉 Welcome Discount',
    subtext: 'Flat ₹100 OFF on orders above ₹499',
    minOrder: 499,
    discountType: 'flat',
    discountValue: 100,
  },
  {
    code: 'FESTIVE20',
    tag: '20% OFF',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: '✨ 20% Festive Treat',
    subtext: '20% OFF up to ₹150 on orders above ₹299',
    minOrder: 299,
    discountType: 'percentage',
    discountValue: 20,
  },
];

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState<'HOME_DELIVERY' | 'STORE_PICKUP'>('HOME_DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 402, Royal Palms Apartment, MG Road, Camp, Pune - 411048'
  );

  // 2. Coupons & Offers State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 3. Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'RAZORPAY' | 'CARD' | 'COD' | 'NETBANKING'
  >('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM'>('GPAY');
  const [upiId, setUpiId] = useState('tejas@okaxis');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = Number(cart?.subtotal || 0);

  // Delivery charge calculation
  let deliveryFee = deliveryMethod === 'HOME_DELIVERY' ? 40 : 0;
  if (appliedCoupon?.discountType === 'delivery') {
    deliveryFee = 0;
  }

  // Tax calculation (5% GST)
  const gst = Number((subtotal * 0.05).toFixed(2));

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.min(150, (subtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === 'delivery') {
      discountAmount = 40;
    }
  }

  // Grand Total calculation
  const grandTotal = Math.max(0, subtotal + (deliveryMethod === 'HOME_DELIVERY' ? deliveryFee : 0) + gst - (appliedCoupon?.discountType === 'delivery' ? 0 : discountAmount));

  const handleApplyCoupon = (coupon: Coupon) => {
    if (subtotal < coupon.minOrder) {
      toast.error(`Add ₹${(coupon.minOrder - subtotal).toFixed(0)} more to apply ${coupon.code}`);
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCodeInput(coupon.code);
    toast.success(`Coupon "${coupon.code}" applied successfully! 🎉`);
  };

  const handleManualApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const found = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCodeInput.trim().toLowerCase()
    );
    if (found) {
      handleApplyCoupon(found);
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) return;

    if (deliveryMethod === 'HOME_DELIVERY' && !deliveryAddress.trim()) {
      toast.error('Please provide a delivery address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      fulfillment_type: deliveryMethod === 'HOME_DELIVERY' ? ('DELIVERY' as FulfillmentType) : ('PICKUP' as FulfillmentType),
      payment_method: paymentMethod as PaymentMethod,
      delivery_address: {
        street: deliveryAddress,
        city: 'Pune',
        state: 'Maharashtra',
        postal_code: '411048',
        contact_number: '+91 98765 43210',
      },
      items: cart?.items?.map((i: any) => ({
        id: i.id,
        product_id: i.product?.id || i.product_id,
        product_name: i.product?.name,
        quantity: i.quantity,
        unit_price: i.product?.price,
        subtotal: i.subtotal,
        image_url: i.product?.image_url,
      })),
      total_amount: grandTotal,
      subtotal_amount: subtotal,
      delivery_charge: deliveryFee,
      tax_amount: gst,
      discount_amount: discountAmount,
      coupon_code: appliedCoupon?.code || null,
      customer_name: user?.full_name || 'Customer User',
      customer_email: user?.email || 'customer@dmart.com',
    };

    try {
      const res = await ordersApi.checkout(payload);
      toast.success('Order placed successfully! 🎉');
      await clearCart();
      await fetchCart();
      const orderObj = (res as any)?.data?.order || (res as any)?.order || (res as any)?.data;
      if (orderObj && orderObj.id) {
        navigate(`/orders/${orderObj.id}`);
      } else {
        navigate('/orders');
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Checkout failed. Please review your order.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-xs">Add items to your cart before proceeding to store checkout.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Return to Products Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your order, delivery method, and payment options.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: 3 Structured Checkout Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: CHOOSE DELIVERY METHOD */}
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                1. Choose Delivery Method
              </h2>
            </div>

            {/* Delivery Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Delivery Card */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  deliveryMethod === 'HOME_DELIVERY'
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${deliveryMethod === 'HOME_DELIVERY' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Home Delivery</span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-800 border border-amber-300 text-[10px] font-black">
                      ⚡ 10 MINS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Superfast delivery straight to your doorstep.
                  </p>
                </div>
              </button>

              {/* Store Pickup Card */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('STORE_PICKUP')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  deliveryMethod === 'STORE_PICKUP'
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${deliveryMethod === 'STORE_PICKUP' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Store Pickup</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pick up directly from nearest Mini D-Mart store.
                  </p>
                </div>
              </button>
            </div>

            {/* Address Input for Home Delivery */}
            {deliveryMethod === 'HOME_DELIVERY' ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> DELIVERY ADDRESS & INSTRUCTIONS
                  </span>
                  <span className="text-rose-500 font-extrabold text-[10px]">*REQUIRED</span>
                </div>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat / House No., Landmark, Area, City, PIN Code..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Mini D-Mart Express Store - Katraj Branch</p>
                  <p className="text-slate-500 text-[11px]">Opp. Lake Town Plaza, Pune - 411048</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  Ready in 10 mins
                </span>
              </div>
            )}
          </section>

          {/* STEP 2: APPLY PROMO COUPONS & OFFERS */}
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  2. Apply Promo Coupons & Offers
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                {AVAILABLE_COUPONS.length} Offers Available
              </span>
            </div>

            {/* Promo Code Input Bar */}
            <form onSubmit={handleManualApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="ENTER PROMO CODE (E.G. RAKHI50)"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </form>

            {/* 4 Available Coupons Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                AVAILABLE COUPONS FOR YOU
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {AVAILABLE_COUPONS.map((c) => {
                  const isApplied = appliedCoupon?.code === c.code;
                  const isEligible = subtotal >= c.minOrder;
                  const shortfall = c.minOrder - subtotal;

                  return (
                    <div
                      key={c.code}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isApplied
                          ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                          : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-slate-900">
                            {c.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${c.tagColor}`}>
                            {c.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 mt-1">{c.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{c.subtext}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5 text-xs">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Min. order: ₹{c.minOrder}
                        </span>

                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700">
                            <Check className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : isEligible ? (
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon(c)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] transition cursor-pointer shadow-2xs"
                          >
                            Apply
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toast(`Add items worth ₹${shortfall.toFixed(0)} to unlock this coupon!`, { icon: '🛒' })}
                            className="px-3 py-1 rounded-lg bg-slate-200 text-slate-600 font-bold text-[11px] hover:bg-slate-300 transition cursor-pointer"
                          >
                            Add ₹{shortfall.toFixed(0)}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* STEP 3: SELECT PAYMENT METHOD */}
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  3. Select Payment Method
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Safe & Secure
              </span>
            </div>

            {/* 5 Payment Mode Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">UPI / QR</span>
                <span className="text-[9px] text-slate-500">GPay, PhonePe, Paytm</span>
              </button>

              {/* Razorpay Gateway */}
              <button
                type="button"
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 relative ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[8px] font-black uppercase">
                  FAST
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">Razorpay Gateway</span>
                <span className="text-[9px] text-slate-500">All-in-One Checkout</span>
              </button>

              {/* Cards */}
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">Cards</span>
                <span className="text-[9px] text-slate-500">Visa, Master, RuPay</span>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">Cash on Delivery</span>
                <span className="text-[9px] text-slate-500">Pay at Doorstep</span>
              </button>

              {/* Net Banking */}
              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">Net Banking</span>
                <span className="text-[9px] text-slate-500">All Indian Banks</span>
              </button>
            </div>

            {/* UPI Sub-Panel */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Choose UPI App or Enter UPI ID:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('GPAY')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUpiApp === 'GPAY'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white"></span> Google Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('PHONEPE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUpiApp === 'PHONEPE'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span> PhonePe
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('PAYTM')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUpiApp === 'PAYTM'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span> Paytm
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('BHIM')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUpiApp === 'BHIM'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    BHIM UPI
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                    UPI ID (Virtual Payment Address)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-24"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      VERIFIED ✓
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sticky Bill Summary */}
        <aside className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Bill Summary</h3>
            <span className="text-xs font-bold text-slate-500">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Item Row Breakdown */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-800 font-bold truncate max-w-[180px]">
                  {item.quantity} × {item.product?.name}
                </span>
                <span className="font-extrabold text-slate-900">
                  ₹{Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Item Total (Subtotal)</span>
              <span className="font-extrabold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Delivery Charge</span>
              <span className="font-extrabold text-slate-900">
                {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>GST / Taxes (5%)</span>
              <span className="font-extrabold text-slate-900">₹{gst.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700 font-extrabold">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 text-[11px] pt-1">
              <span>Selected Payment:</span>
              <span className="font-bold text-slate-800">⚡ {paymentMethod}</span>
            </div>
          </div>

          {/* Total Payable */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-black text-slate-900 uppercase tracking-wider">Total Payable</span>
            <span className="text-2xl font-black text-emerald-800">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Final Action Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>
                  Pay via {paymentMethod} • ₹{grandTotal.toFixed(2)}
                </span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 font-semibold flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Secure 256-Bit Encrypted Checkout
          </p>
        </aside>
      </div>
    </div>
  );
};
