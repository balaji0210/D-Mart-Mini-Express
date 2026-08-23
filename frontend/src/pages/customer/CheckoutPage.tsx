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
  AlertCircle,
  Calendar,
  Layers,
  Flame,
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

const STORES = [
  {
    id: 'store-1',
    name: 'Mini D-Mart Express — Katraj Flagship Store',
    address: 'Opp. Lake Town Plaza, Bibwewadi-Katraj Rd, Pune - 411048',
    city: 'Pune',
    timing: '08:00 AM - 10:00 PM',
  },
  {
    id: 'store-2',
    name: 'Mini D-Mart Express — Kothrud Express Hub',
    address: 'Near City Pride Kothrud, Paud Road, Pune - 411038',
    city: 'Pune',
    timing: '08:00 AM - 10:00 PM',
  },
  {
    id: 'store-3',
    name: 'Mini D-Mart Express — Hinjewadi Tech Park',
    address: 'Phase 1, Rajiv Gandhi Infotech Park, Hinjewadi, Pune - 411057',
    city: 'Pune',
    timing: '08:00 AM - 10:00 PM',
  },
];

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Delivery & Store Pickup State
  const [deliveryMethod, setDeliveryMethod] = useState<'HOME_DELIVERY' | 'STORE_PICKUP'>('HOME_DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 402, Royal Palms Apartment, MG Road, Camp, Pune - 411048'
  );
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-1');
  const [selectedPickupDate, setSelectedPickupDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-1');
  const [pickupSlots, setPickupSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

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

  // Load Pickup Slots
  const loadPickupSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const res = await ordersApi.getPickupSlots();
      if (res.success && res.data) {
        setPickupSlots(res.data);
        if (res.data.length > 0 && !selectedSlotId) {
          setSelectedSlotId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load pickup slots:', err);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadPickupSlots();
  }, []);

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
  const grandTotal = Math.max(
    0,
    subtotal +
      (deliveryMethod === 'HOME_DELIVERY' ? deliveryFee : 0) +
      gst -
      (appliedCoupon?.discountType === 'delivery' ? 0 : discountAmount)
  );

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

    const selectedStore = STORES.find((s) => s.id === selectedStoreId) || STORES[0];
    const selectedSlot = pickupSlots.find((s) => s.id === selectedSlotId);

    const payload = {
      fulfillment_type: deliveryMethod === 'HOME_DELIVERY' ? ('DELIVERY' as FulfillmentType) : ('PICKUP' as FulfillmentType),
      payment_method: paymentMethod as PaymentMethod,
      delivery_address: {
        street: deliveryMethod === 'HOME_DELIVERY' ? deliveryAddress : selectedStore.address,
        city: 'Pune',
        state: 'Maharashtra',
        postal_code: '411048',
        contact_number: '+91 98765 43210',
      },
      pickup_slot_id: deliveryMethod === 'STORE_PICKUP' ? selectedSlotId : undefined,
      pickup_slot: deliveryMethod === 'STORE_PICKUP' ? selectedSlot : undefined,
      store_id: deliveryMethod === 'STORE_PICKUP' ? selectedStore.id : undefined,
      store_name: deliveryMethod === 'STORE_PICKUP' ? selectedStore.name : undefined,
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

  // Format time display for pickup slots
  const formatSlotTime = (startTime: string, endTime: string) => {
    const formatH = (t: string) => {
      if (!t) return '';
      const parts = t.split(':');
      let h = parseInt(parts[0], 10);
      const m = parts[1] || '00';
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return `${h}:${m} ${ampm}`;
    };
    return `${formatH(startTime)} - ${formatH(endTime)}`;
  };

  // Filter slots for selected date tab
  const todayStr = new Date().toISOString().split('T')[0];
  const activeDateSlots = pickupSlots.length > 0 ? pickupSlots : [
    { id: 'slot-1', date: todayStr, start_time: '09:00:00', end_time: '11:00:00', capacity: 15, booked: 2, available: 13 },
    { id: 'slot-2', date: todayStr, start_time: '11:00:00', end_time: '13:00:00', capacity: 15, booked: 4, available: 11 },
    { id: 'slot-3', date: todayStr, start_time: '14:00:00', end_time: '16:00:00', capacity: 15, booked: 1, available: 14 },
    { id: 'slot-4', date: todayStr, start_time: '16:00:00', end_time: '18:00:00', capacity: 15, booked: 6, available: 9 },
    { id: 'slot-5', date: todayStr, start_time: '18:00:00', end_time: '20:00:00', capacity: 15, booked: 8, available: 7 },
    { id: 'slot-6', date: todayStr, start_time: '20:00:00', end_time: '22:00:00', capacity: 15, booked: 3, available: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link to="/cart" className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Express Checkout</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure Checkout
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select delivery mode, scheduled pickup slots, and payment options.
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
          {/* STEP 1: CHOOSE DELIVERY / STORE PICKUP METHOD */}
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  1. Fulfillment Method & Scheduled Slot
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700">Step 1 of 3</span>
            </div>

            {/* Delivery Option Toggle Cards */}
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
                <div
                  className={`p-2.5 rounded-xl ${
                    deliveryMethod === 'HOME_DELIVERY' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Home Delivery</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 border border-amber-300 text-[10px] font-black">
                      ⚡ 10 MINS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Express doorstep delivery (₹40 or Free with coupon).</p>
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
                <div
                  className={`p-2.5 rounded-xl ${
                    deliveryMethod === 'STORE_PICKUP' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Store Pickup</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      FREE • ZERO QUEUE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Scheduled time slots & counter express bays.</p>
                </div>
              </button>
            </div>

            {/* HOME DELIVERY: Address Input */}
            {deliveryMethod === 'HOME_DELIVERY' && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Address & Street Details
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
            )}

            {/* STORE PICKUP: Store Branch Selection + 2-Hour Scheduled Time Slots */}
            {deliveryMethod === 'STORE_PICKUP' && (
              <div className="space-y-5 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
                {/* 1. Store Location Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-600" /> Select Mini D-Mart Pickup Location:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {STORES.map((store) => {
                      const isSelected = selectedStoreId === store.id;
                      return (
                        <button
                          key={store.id}
                          type="button"
                          onClick={() => setSelectedStoreId(store.id)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900">{store.name.split('—')[1]}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight font-medium">
                              {store.address}
                            </p>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-extrabold mt-2">
                            Open: {store.timing}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Pickup Date Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Select Pickup Date:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPickupDate('today')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                        selectedPickupDate === 'today'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" /> Today (Express Pickup)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPickupDate('tomorrow')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                        selectedPickupDate === 'tomorrow'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Calendar className="w-3 h-3" /> Tomorrow
                    </button>
                  </div>
                </div>

                {/* 3. 2-Hour Scheduled Express Pickup Time Slots */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> Select 2-Hour Scheduled Pickup Time Window:
                    </label>
                    <span className="text-[10px] text-emerald-800 font-black uppercase">
                      ⚡ Dynamic Slot Capacity
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-16 rounded-2xl bg-slate-100 animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activeDateSlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const available = slot.available !== undefined ? slot.available : 12;
                        const isFull = available <= 0;
                        const isHighDemand = available <= 8 && available > 0;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={isFull}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                              isFull
                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                : isSelected
                                ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900">
                                {formatSlotTime(slot.start_time, slot.end_time)}
                              </span>
                              {isSelected ? (
                                <span className="p-1 rounded-full bg-emerald-600 text-white">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              {isFull ? (
                                <span className="font-bold text-rose-600 uppercase">Slot Full</span>
                              ) : isHighDemand ? (
                                <span className="inline-flex items-center gap-0.5 font-black text-amber-700">
                                  <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {available} Slots Left (Fast Filling!)
                                </span>
                              ) : (
                                <span className="font-bold text-emerald-800">
                                  ⚡ {available} / {slot.capacity || 15} Slots Available
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Staging Bay Guarantee Notice */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-emerald-950">Guaranteed Express Staging Bay Slot</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed font-medium">
                      Your order will be packed, quality-inspected, and staged in a designated shelf bay (e.g. <strong>Bay A-03</strong>) ready for instant handover.
                    </p>
                  </div>
                </div>
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
                          <span className="font-mono font-black text-xs text-slate-900">{c.code}</span>
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
                            onClick={() =>
                              toast(`Add items worth ₹${shortfall.toFixed(0)} to unlock this coupon!`, {
                                icon: '🛒',
                              })
                            }
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

          {/* STEP 3: PAYMENT METHOD OPTIONS */}
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  3. Select Payment Method
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700">Step 3 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Instant UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900">Instant UPI QR / App</span>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
                {paymentMethod === 'UPI' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Option 2: Razorpay Gateway */}
              <button
                type="button"
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900">Razorpay Gateway</span>
                    <p className="text-[11px] text-slate-500">Fast card & netbanking checkout</p>
                  </div>
                </div>
                {paymentMethod === 'RAZORPAY' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Option 3: Credit / Debit Cards */}
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900">Credit / Debit Card</span>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                {paymentMethod === 'CARD' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Option 4: Cash on Delivery / Pay on Pickup */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900">
                      {deliveryMethod === 'STORE_PICKUP' ? 'Pay at Store Counter' : 'Cash on Delivery (COD)'}
                    </span>
                    <p className="text-[11px] text-slate-500">Cash or UPI at counter / doorstep</p>
                  </div>
                </div>
                {paymentMethod === 'COD' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-6">
          <section className="dmart-card p-6 rounded-3xl border border-slate-200 shadow-xs bg-white space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">Order Bill Summary</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {cart.total_items} items
              </span>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-black text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery / Store Pickup</span>
                {deliveryMethod === 'STORE_PICKUP' || deliveryFee === 0 ? (
                  <span className="font-black text-emerald-700 uppercase">FREE</span>
                ) : (
                  <span className="font-black text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>GST (5% Included)</span>
                <span className="font-bold text-slate-700">₹{gst.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-extrabold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-slate-900">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-emerald-600/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Pay & Place Order • ₹{grandTotal.toFixed(2)}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
