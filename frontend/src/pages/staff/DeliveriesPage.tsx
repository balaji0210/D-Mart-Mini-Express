import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, CheckCircle2, PackageCheck, Search, UserCheck, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff';
import { Order, OrderStatus } from '../../types/order';

export const StaffDeliveriesPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchDeliveries = async () => {
    try {
      const res = await staffApi.getAssignedOrders();
      if (res.data) {
        const orderList = Array.isArray(res.data) ? res.data : res.data.orders || [];
        // Filter orders for Delivery or general dispatch
        const deliveryList = orderList.filter((o: Order) => o.fulfillment_type === 'DELIVERY' || !o.fulfillment_type);
        setOrders(deliveryList);
      }
    } catch (err) {
      console.error('Failed to load deliveries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(() => {
      fetchDeliveries();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateDeliveryStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await staffApi.updateOrderStatus(orderId, newStatus);
      if (res.success || res.data) {
        toast.success(`Order delivery updated to ${newStatus.replace('_', ' ')}!`);
        await fetchDeliveries();
      }
    } catch (err: any) {
      toast.error('Failed to update delivery status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" /> Home Delivery Orders Queue
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Dispatch management • Customer address tracking, rider handover & proof of delivery
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Delivery # or Customer..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PREPARING">Preparing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="COMPLETED">Delivered</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="dmart-card p-6 animate-pulse h-48 rounded-2xl bg-slate-100"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="dmart-card p-12 rounded-3xl text-center space-y-3">
          <Truck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Home Delivery Orders</h3>
          <p className="text-slate-500 text-xs">All assigned delivery tasks are cleared or none are active.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="dmart-card p-5 rounded-2xl border border-slate-200 space-y-4 hover:border-blue-300 transition shadow-2xs"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    #{order.order_number}
                  </span>
                  <span className="badge-info text-[10px]">{order.status}</span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  ₹{Number(order.total_amount).toFixed(0)}
                </span>
              </div>

              {/* Recipient & Address */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    {order.customer_name || 'Customer'}
                  </span>
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3" /> +91 98765 43210
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {order.delivery_address?.street || 'Flat 402, Royal Palms Apartment, MG Road'},{' '}
                    {order.delivery_address?.city || 'Pune'}, {order.delivery_address?.postal_code || '411048'}
                  </span>
                </div>
              </div>

              {/* Rider & Action Controls */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-500 font-medium">
                  Rider: <strong className="text-slate-800">Express Rider (Rajesh)</strong>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateDeliveryStatus(order.id, 'OUT_FOR_DELIVERY')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs transition"
                    >
                      <Truck className="w-3.5 h-3.5" /> Handover to Rider
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateDeliveryStatus(order.id, 'COMPLETED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Delivered
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
