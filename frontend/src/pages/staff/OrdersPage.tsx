import React, { useState, useEffect } from 'react';
import { PackageCheck, ArrowRight, Filter, Search, CheckCircle, CreditCard, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff';
import { apiClient } from '../../api/client';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';

export const StaffOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await staffApi.getAssignedOrders();
      if (res.data) {
        const orderList = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(orderList);
      }
    } catch (err) {
      console.error('Failed to load staff orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await staffApi.updateOrderStatus(orderId, newStatus);
      if (res.success || res.data) {
        toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        await fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid status transition.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentChange = async (orderId: string, paymentStatus: PaymentStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await staffApi.updatePaymentStatus(orderId, paymentStatus);
      if (res.success || res.data) {
        toast.success(`Order marked as PAID!`);
        await fetchOrders();
      }
    } catch (err: any) {
      toast.error('Failed to update payment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge-success">COMPLETED</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge-info">READY FOR PICKUP</span>;
      case 'PREPARING':
        return <span className="badge-warning">PREPARING</span>;
      case 'CONFIRMED':
        return <span className="badge-neutral">CONFIRMED</span>;
      default:
        return <span className="badge-warning">PENDING</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return <span className="badge-success">PAID</span>;
      default:
        return <span className="badge-warning">UNPAID</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-teal-600" /> Customer Counter Pickup Queue
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Customer-facing fulfillment desk: collect payments, verify checklist, and complete store pickups
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dmart-card p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order # or Customer..."
            className="dmart-input pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dmart-select w-40"
          >
            <option value="ALL">All Active Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredOrders.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No customer orders matching active filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="dmart-card p-6 space-y-4 dmart-card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-900 font-mono">#{order.order_number}</span>
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status || 'PENDING')}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Customer: <span className="font-bold text-slate-900">{order.customer_name || 'Customer'}</span> • Total: <span className="font-bold text-teal-800 text-sm">₹{order.total_amount}</span> • Method: <span className="font-semibold text-slate-900">{order.payment_method || 'CASH'}</span>
                  </p>
                </div>

                {/* Direct Counter Operation Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {order.payment_status !== 'PAID' && (
                    <button
                      onClick={() => handlePaymentChange(order.id, 'PAID')}
                      disabled={updatingId === order.id}
                      className="btn-secondary py-1.5 px-3 text-xs bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-bold"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> Collect Payment (Mark Paid)
                    </button>
                  )}

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                      disabled={updatingId === order.id}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      Confirm Order
                    </button>
                  )}
                  {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      disabled={updatingId === order.id}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'READY_FOR_PICKUP')}
                      disabled={updatingId === order.id}
                      className="btn-primary py-1.5 px-3 text-xs bg-teal-600 hover:bg-teal-700"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Ready for Pickup
                    </button>
                  )}
                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                      disabled={updatingId === order.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Complete Pickup & Handover
                    </button>
                  )}
                </div>
              </div>

              {/* Items Checklist */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-700 uppercase tracking-wider">Order Items Checklist ({order.items_count} items):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{item.quantity}x {item.product_name}</span>
                      <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
