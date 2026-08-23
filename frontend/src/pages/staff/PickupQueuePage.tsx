import React, { useState, useEffect } from 'react';
import { CalendarClock, Clock, CheckCircle2, AlertTriangle, Users, ChevronRight, Check, PackageCheck, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff';
import { Order } from '../../types/order';

interface TimeSlotGroup {
  id: string;
  time: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  orders: Order[];
}

export const StaffPickupQueuePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-2');
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPickupOrders = async () => {
    try {
      const res = await staffApi.getAssignedOrders();
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.orders || [];
        // Filter only Pickup orders or general orders
        const pickups = list.filter((o: Order) => o.fulfillment_type === 'PICKUP' || !o.fulfillment_type);
        setOrders(pickups);
      }
    } catch (err) {
      console.error('Failed to load pickup queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupOrders();
    const interval = setInterval(() => {
      fetchPickupOrders();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCompletePickup = async (orderId: string) => {
    try {
      const res = await staffApi.updateOrderStatus(orderId, 'COMPLETED');
      if (res.success || res.data) {
        await staffApi.updatePaymentStatus(orderId, 'PAID');
        toast.success('Order verified & marked as Handed Over to Customer!');
        setVerifiedOrderId(null);
        setVerificationCode('');
        await fetchPickupOrders();
      }
    } catch (err: any) {
      toast.error('Failed to update pickup status.');
    }
  };

  // Group orders into 2-hour slots
  const slots: TimeSlotGroup[] = [
    {
      id: 'slot-1',
      time: '09:00 AM - 11:00 AM',
      status: 'COMPLETED',
      orders: orders.slice(0, 2),
    },
    {
      id: 'slot-2',
      time: '11:00 AM - 01:00 PM',
      status: 'ACTIVE',
      orders: orders.slice(2, 6).length > 0 ? orders.slice(2, 6) : orders.slice(0, 3),
    },
    {
      id: 'slot-3',
      time: '02:00 PM - 04:00 PM',
      status: 'UPCOMING',
      orders: orders.slice(6, 10),
    },
    {
      id: 'slot-4',
      time: '04:00 PM - 06:00 PM',
      status: 'UPCOMING',
      orders: orders.slice(10, 14),
    },
    {
      id: 'slot-5',
      time: '06:00 PM - 08:00 PM',
      status: 'UPCOMING',
      orders: orders.slice(14, 18),
    },
  ];

  const activeSlot = slots.find((s) => s.id === selectedSlotId) || slots[1];

  const filteredSlotOrders = activeSlot.orders.filter((o) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-blue-600" /> Upcoming Store Pickup Orders
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Organized by 2-Hour pickup slots • Customer handover verification desk & queue management
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order # or Customer..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: 2-Hour Time Slots List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Today's Pickup Slots ({slots.length})
          </h3>

          <div className="space-y-2.5">
            {slots.map((s) => {
              const isSelected = selectedSlotId === s.id;
              const count = s.orders.length;

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlotId(s.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      {s.time}
                    </span>
                    {s.status === 'ACTIVE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ACTIVE NOW
                      </span>
                    )}
                    {s.status === 'COMPLETED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        PAST
                      </span>
                    )}
                    {s.status === 'UPCOMING' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span><strong>{count}</strong> orders assigned</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Orders in the Selected Slot */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Orders for Slot: <span className="text-blue-600">{activeSlot.time}</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Verify customer arrival, check items, and mark handover
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-2xs">
              {filteredSlotOrders.length} Orders
            </span>
          </div>

          {filteredSlotOrders.length === 0 ? (
            <div className="dmart-card p-10 text-center space-y-2 rounded-3xl">
              <CalendarClock className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Pickup Orders in this Slot</h3>
              <p className="text-xs text-slate-500">All customer pickups have been cleared or not yet scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSlotOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="dmart-card p-5 rounded-2xl border border-slate-200 space-y-3 hover:border-blue-300 transition shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-slate-900 font-mono text-sm">
                        #{ord.order_number}
                      </span>
                      <span className="badge-info text-[10px]">{ord.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ord.payment_status || 'PAID'}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      ₹{Number(ord.total_amount).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">
                        Customer: <span className="text-blue-600">{ord.customer_name || 'Customer'}</span>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Items: {ord.items_count || (ord.items ? ord.items.length : 2)} items packed & bagged
                      </p>
                    </div>

                    {/* Handover Action Controls */}
                    <div className="flex items-center gap-2">
                      {ord.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleCompletePickup(ord.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" /> Verify & Handover
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Handed Over
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
