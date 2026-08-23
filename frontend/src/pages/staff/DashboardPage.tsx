import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, CalendarClock, PackageCheck, AlertTriangle, ArrowRight, UserCheck, Play, Check, RotateCcw, Truck, Boxes, ShoppingBag
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
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 2500);
    return () => clearInterval(interval);
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
  const pickupOrders = orders.filter(o => o.fulfillment_type === 'PICKUP' || !o.fulfillment_type);
  const deliveryOrders = orders.filter(o => o.fulfillment_type === 'DELIVERY');
  const readyPickups = pickupOrders.filter(o => o.status === 'READY_FOR_PICKUP');
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
            <UserCheck className="w-6 h-6 text-blue-600" /> Store Operations Staff Dashboard
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time fulfillment desk • Order preparation, pickup verification, deliveries, inventory & returns
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/staff/returns" className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs">
            <RotateCcw className="w-4 h-4 text-rose-600" /> Returns Review ({pendingReturns.length})
          </Link>
          <Link to="/staff/orders" className="btn-primary">
            <ClipboardList className="w-4 h-4" /> Order Preparation
          </Link>
        </div>
      </div>

      {/* 5 Core Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* 1. Order Preparation */}
        <Link to="/staff/orders" className="dmart-card p-4 border-l-4 border-l-amber-500 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Preparation Queue</span>
            <ClipboardList className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pending.length + preparing.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold">{preparing.length} In-Progress</span>
        </Link>

        {/* 2. Upcoming Pickups */}
        <Link to="/staff/pickup-queue" className="dmart-card p-4 border-l-4 border-l-blue-600 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Upcoming Pickups</span>
            <CalendarClock className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{readyPickups.length}</p>
          <span className="text-[10px] text-blue-700 font-semibold">{pickupOrders.length} Total Today</span>
        </Link>

        {/* 3. Delivery Orders */}
        <Link to="/staff/deliveries" className="dmart-card p-4 border-l-4 border-l-indigo-500 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Delivery Orders</span>
            <Truck className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{deliveryOrders.length}</p>
          <span className="text-[10px] text-indigo-700 font-semibold">Home Dispatch</span>
        </Link>

        {/* 4. Inventory Stock Updates */}
        <Link to="/staff/inventory-updates" className="dmart-card p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Inventory & Stock</span>
            <Boxes className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">Live</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Stock Adjustment</span>
        </Link>

        {/* 5. Return / Exchange Processing */}
        <Link to="/staff/returns" className="dmart-card p-4 border-l-4 border-l-rose-500 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Return / Exchange</span>
            <RotateCcw className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{pendingReturns.length}</p>
          <span className="text-[10px] text-rose-700 font-semibold">{returnRequests.length} Total Logged</span>
        </Link>
      </div>

      {/* Module Quick Nav Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link to="/staff/orders" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition group shadow-2xs">
          <ClipboardList className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Order Preparation</span>
          <span className="text-[10px] text-slate-500">Pick & pack checklist</span>
        </Link>

        <Link to="/staff/pickup-queue" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition group shadow-2xs">
          <CalendarClock className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Upcoming Pickups</span>
          <span className="text-[10px] text-slate-500">2-Hour slot schedule</span>
        </Link>

        <Link to="/staff/deliveries" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition group shadow-2xs">
          <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Delivery Orders</span>
          <span className="text-[10px] text-slate-500">Address & dispatch</span>
        </Link>

        <Link to="/staff/inventory-updates" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition group shadow-2xs">
          <Boxes className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Inventory Updates</span>
          <span className="text-[10px] text-slate-500">Stock & adjustments</span>
        </Link>

        <Link to="/staff/returns" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-center transition group shadow-2xs">
          <RotateCcw className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Return / Exchange</span>
          <span className="text-[10px] text-slate-500">Approve & refund</span>
        </Link>
      </div>

      {/* Urgent Fulfillment Action Queue */}
      <div className="dmart-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Orders In Queue</h3>
            <p className="text-xs text-slate-500">Advance order states with one-click fulfillment actions</p>
          </div>
          <Link to="/staff/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No pending fulfillment tasks assigned to your queue.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 8).map((ord) => (
              <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">#{ord.order_number}</span>
                    <span className="badge-info">{ord.status}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${ord.fulfillment_type === 'DELIVERY' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                      {ord.fulfillment_type || 'PICKUP'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{ord.customer_name || 'Customer'}</span> • {ord.items_count || 1} items • ₹{Number(ord.total_amount).toFixed(0)}
                  </p>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {ord.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'CONFIRMED')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs transition flex items-center gap-1"
                    >
                      Confirm Order
                    </button>
                  )}

                  {ord.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Start Packing
                    </button>
                  )}

                  {ord.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, ord.fulfillment_type === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      {ord.fulfillment_type === 'DELIVERY' ? 'Dispatch Rider' : 'Mark Ready for Pickup'}
                    </button>
                  )}

                  {(ord.status === 'READY_FOR_PICKUP' || ord.status === 'OUT_FOR_DELIVERY') && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'COMPLETED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Complete Order
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
