import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, CalendarClock, MapPin, AlertCircle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders';
import { PickupSlot, FulfillmentType, PaymentMethod } from '../../types/order';
import { useCart } from '../../context/CartContext';
import { PaymentModal } from '../../components/checkout/PaymentModal';

import { useAuth } from '../../context/AuthContext';

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fulfillmentType] = useState<FulfillmentType>('PICKUP');
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    ordersApi.getPickupSlots().then((res) => {
      if (res.success && res.data) {
        setPickupSlots(res.data);
      }
    });
  }, []);

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedSlotId) {
      setError('Please select an available store pickup slot.');
      return;
    }

    setPaymentModalOpen(true);
  };

  const handleFinalCheckout = async (paymentMethod: PaymentMethod) => {
    setPaymentModalOpen(false);
    setIsLoading(true);
    setError(null);

    const payload = {
      fulfillment_type: 'PICKUP' as FulfillmentType,
      pickup_slot_id: selectedSlotId,
      payment_method: paymentMethod,
      items: cart?.items?.map((i: any) => ({
        id: i.id,
        product_id: i.product?.id || i.product_id,
        product_name: i.product?.name,
        quantity: i.quantity,
        unit_price: i.product?.price,
        subtotal: i.subtotal,
        image_url: i.product?.image_url,
      })),
      total_amount: cart?.subtotal,
      customer_name: user?.full_name || 'Customer User',
      customer_email: user?.email || 'customer@dmart.com',
    };


    try {
      const res = await ordersApi.checkout(payload);
      toast.success('Order placed successfully!');
      await clearCart();
      await fetchCart();
      const orderObj = (res as any)?.data?.order || (res as any)?.order || (res as any)?.data;
      if (orderObj && orderObj.id) {
        navigate(`/orders/${orderObj.id}`);
      } else {
        navigate('/orders');
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data?.message || 'Stock or pickup slot capacity conflict during checkout.');
      } else {
        const errMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : null) ||
          'Checkout failed. Please review your order.';
        setError(errMsg);
      }
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

  const subtotal = Number(cart.subtotal || 0);
  const taxAmount = subtotal * 0.05;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Store className="w-7 h-7 text-teal-600" /> Express Store Checkout
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Select an active pickup time slot, confirm cart stock, and finalize your order
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleOpenPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup Slot Selection */}
          <div className="dmart-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              <CalendarClock className="w-5 h-5 text-teal-600" />
              1. Select Store Pickup Time Slot
            </div>
            <p className="text-xs text-slate-500">
              Only active, non-expired slots with available capacity are enabled for reservation.
            </p>

            {pickupSlots.length === 0 ? (
              <p className="text-sm text-amber-600">Loading available pickup slots...</p>
            ) : (
              <div className="space-y-3">
                {pickupSlots.map((slot) => {
                  const isPast = slot.is_past;
                  const capacity = slot.capacity || slot.max_capacity || 15;
                  const booked = slot.booked || slot.booked_count || 0;
                  const available = slot.available !== undefined ? slot.available : capacity - booked;
                  const isFull = available <= 0;
                  const isInactive = !slot.is_active;
                  const isDisabled = isPast || isFull || isInactive;

                  let statusText = `${available} / ${capacity} Slots Available`;
                  let statusClass = 'badge-success';

                  if (isPast) {
                    statusText = 'EXPIRED (Past Time)';
                    statusClass = 'badge-warning';
                  } else if (isFull) {
                    statusText = 'FULL (Fully Booked)';
                    statusClass = 'badge-danger';
                  } else if (isInactive) {
                    statusText = 'UNAVAILABLE';
                    statusClass = 'badge-neutral';
                  }

                  return (
                    <label
                      key={slot.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition ${
                        selectedSlotId === slot.id
                          ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500 text-slate-900 font-semibold'
                          : isDisabled
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed text-slate-400'
                          : 'bg-white border-slate-200 hover:border-teal-300 cursor-pointer text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pickup_slot"
                          disabled={isDisabled}
                          checked={selectedSlotId === slot.id}
                          onChange={() => {
                            if (!isDisabled) setSelectedSlotId(slot.id);
                          }}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500 disabled:opacity-30"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-900">
                            {slot.date} • {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                          </p>
                          {isPast && (
                            <p className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Slot time has passed
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className={statusClass}>{statusText}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="dmart-card p-6 space-y-6 h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

          <div className="space-y-2.5 text-xs">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-slate-700">
                <span className="truncate pr-2">{item.quantity}x {item.product?.name}</span>
                <span className="font-semibold text-slate-900 shrink-0">₹{Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2 border-t border-slate-100">
              <span>Final Total</span>
              <span className="text-teal-700 text-base">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-sm"
          >
            {isLoading ? 'Processing Order...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        totalAmount={grandTotal}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handleFinalCheckout}
      />
    </div>
  );
};
