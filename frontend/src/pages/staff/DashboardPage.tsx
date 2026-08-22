
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, CalendarClock, CheckCircle, Clock, PackageCheck, AlertTriangle, ArrowRight, UserCheck, Play, Check, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff';
import { returnsApi } from '../../api/returns';
import { Order, OrderStatus, ReturnExchangeRequest } from '../../types/order';

export const StaffDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, returnsRes] = await Promise.allSettled([
        staffApi.getAssignedOrders(),
        returnsApi.getRequests(),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
        const res = ordersRes.value.data;
        setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []);
      }

      if (returnsRes.status === 'fulfilled' && returnsRes.value.data) {
        const reqs = returnsRes.value.data.data || returnsRes.value.data;
        setReturnRequests(Array.isArray(reqs) ? reqs : []);
      }
    } catch (err) {
      console.error('Failed to fetch staff dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await staffApi.updateOrderStatus(orderId, status);
      if (res.success) {
        toast.success(`Order status updated to ${status.replace('_', ' ')}`);
        await fetchDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const pending = orders.filter(o => o.status === 'PENDING');
  const preparing = orders.filter(o => o.status === 'PREPARING');
  const ready = orders.filter(o => o.status === 'READY_FOR_PICKUP');
  const pendingReturns = returnRequests.filter(r => r.status === 'REQUESTED');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="dmart-card p-8 animate-pulse h-40"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-teal-600" /> Staff Fulfillment Desk
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Daily order preparation queue, return & refund review desk, and pickup schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/staff/returns" className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 font-bold text-xs transition flex items-center gap-1.5 shadow-xs">
            <RotateCcw className="w-4 h-4 text-teal-600" /> Returns & Refunds ({pendingReturns.length})
          </Link>
          <Link to="/staff/orders" className="btn-primary">
            <ClipboardList className="w-4 h-4" /> Full Orders Queue
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="dmart-card p-4 border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Pending Orders</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pending.length}</p>
        </div>

        <div className="dmart-card p-4 border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Preparing</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{preparing.length}</p>
        </div>

        <div className="dmart-card p-4 border-l-4 border-l-teal-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Ready Pickup</span>
          <p className="text-2xl font-extrabold text-teal-700 mt-1">{ready.length}</p>
        </div>

        <div className="dmart-card p-4 border-l-4 border-l-rose-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Returns Review</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{pendingReturns.length}</p>
        </div>

        <div className="dmart-card p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Requests</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{returnRequests.length}</p>
        </div>
      </div>

      {/* Urgent Fulfillment Queue */}
      <div className="dmart-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Immediate Preparation Tasks</h3>
          <span className="text-xs font-semibold text-slate-500">Fast Actions</span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No pending fulfillment tasks assigned to your queue.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 6).map((ord) => (
              <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">#{ord.order_number}</span>
                    <span className="badge-info">{ord.status}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{ord.customer_name || 'Customer'}</span> • {ord.items_count} items
                  </p>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2">
                  {ord.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'CONFIRMED')}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      Confirm Order
                    </button>
                  )}
                  {(ord.status === 'PENDING' || ord.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                      className="btn-primary py-1 px-3 text-xs"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Prep
                    </button>
                  )}
                  {ord.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'READY_FOR_PICKUP')}
                      className="btn-primary py-1 px-3 text-xs bg-teal-600 hover:bg-teal-700"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Ready
                    </button>
                  )}
                  {ord.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'COMPLETED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs"
                    >
                      Complete Pickup
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
