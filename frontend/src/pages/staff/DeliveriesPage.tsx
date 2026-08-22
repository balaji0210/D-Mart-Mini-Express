import React, { useState, useEffect } from 'react';
import { Truck, MapPin } from 'lucide-react';
import { ordersApi } from '../../api/orders';
import { Order } from '../../types/order';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const StaffDeliveriesPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getOrders({ fulfillment_type: 'DELIVERY' })
      .then((res) => {
        if (res.data) {
          const orderList = Array.isArray(res.data.orders)
            ? res.data.orders
            : Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.results?.orders)
            ? res.results.orders
            : [];
          setOrders(orderList);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100">Home Deliveries Queue</h1>
        <p className="text-slate-400 text-sm mt-1">Orders assigned for home dispatch and delivery</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 rounded-3xl animate-pulse h-64"></div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border border-slate-800">
          <Truck className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No home delivery orders in queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100 text-base">{order.order_number}</span>
                  <StatusBadge status={order.status} />
                </div>
                <span className="text-sm font-extrabold text-teal-400">${Number(order.total_amount).toFixed(2)}</span>
              </div>

              {order.delivery_address && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state} ({order.delivery_address.postal_code})</p>
                    <p className="text-slate-400">Phone: {order.delivery_address.contact_number}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
