import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle2, Clock, RotateCcw, PackageCheck, ArrowRight } from 'lucide-react';
import { returnsApi } from '../../api/returns';
import { ordersApi } from '../../api/orders';
import { Order, ReturnExchangeRequest } from '../../types/order';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ReturnRequestModal } from '../../components/customer/ReturnRequestModal';

export const ReturnsPage: React.FC = () => {
  const [requests, setRequests] = useState<ReturnExchangeRequest[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);

  const fetchData = async () => {
    try {
      const [returnsRes, ordersRes] = await Promise.allSettled([
        returnsApi.getRequests(),
        ordersApi.getOrders(),
      ]);

      if (returnsRes.status === 'fulfilled' && returnsRes.value.data) {
        const data = returnsRes.value.data.data || returnsRes.value.data;
        setRequests(Array.isArray(data) ? data : []);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
        const orderList = Array.isArray(ordersRes.value.data.orders)
          ? ordersRes.value.data.orders
          : Array.isArray(ordersRes.value.data)
          ? ordersRes.value.data
          : Array.isArray(ordersRes.value.data.results?.orders)
          ? ordersRes.value.data.results.orders
          : [];
        setCompletedOrders(
          orderList.filter((o: Order) => o.status === 'COMPLETED' || o.status === 'DELIVERED')
        );
      }
    } catch (err) {
      console.error('Failed to load return requests or orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Returns & Refund Requests</h1>
          <p className="text-slate-500 text-xs mt-0.5">Track status and staff approval for your return & refund requests</p>
        </div>
        <div className="flex items-center gap-2">
          {completedOrders.length > 0 && (
            <button
              onClick={() => setSelectedOrderForReturn(completedOrders[0])}
              className="btn-primary py-2 px-4 text-xs"
            >
              <RotateCcw className="w-4 h-4" /> Request New Return
            </button>
          )}
          <Link
            to="/orders"
            className="btn-secondary py-2 px-4 text-xs"
          >
            <PackageCheck className="w-4 h-4" /> View All Orders
          </Link>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Return Requests Found</h3>
          <p className="text-slate-500 text-xs">You haven't submitted any return or refund requests yet.</p>
          <Link to="/orders" className="btn-primary">
            Browse Delivered Orders to Initiate Return
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const orderNum = req.order_number;
            const orderId = req.order_id;

            return (
              <div key={req.id} className="dmart-card p-6 space-y-3 dmart-card-hover">
                {/* Header bar with Order Number and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {orderNum && (
                      <span className="font-extrabold text-slate-900 text-sm font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        Order #{orderNum}
                      </span>
                    )}
                    <span className="font-bold text-teal-700 uppercase text-xs tracking-wider px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200">
                      {req.request_type === 'RETURN' ? 'RETURN & REFUND' : req.request_type}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{req.order_item?.product_name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    {orderId && (
                      <Link
                        to={`/orders/${orderId}`}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-800">Returned Item:</span> {req.order_item?.product_name} ({req.order_item?.quantity}x — ₹{Number(req.order_item?.subtotal || 0).toFixed(2)})
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Reason for Request:</span> {req.reason}
                  </p>
                </div>

                {/* Status Callout Box */}
                {req.status === 'APPROVED' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ACCEPTED / APPROVED BY STAFF
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Your return request has been approved by store staff. Please hand over the item to receive your refund or replacement.
                    </p>
                  </div>
                )}

                {req.status === 'REQUESTED' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> PENDING STAFF REVIEW
                    </span>
                    <p className="text-[11px] text-amber-800">
                      Your return request for Order #{orderNum || ''} is currently being reviewed by store management.
                    </p>
                  </div>
                )}

                {req.status === 'REJECTED' && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
                    <span className="font-bold text-rose-950 block">✕ RETURN REQUEST REJECTED</span>
                    {req.rejection_reason && (
                      <div className="p-2.5 rounded-lg bg-white border border-rose-200 text-rose-900 text-xs">
                        <span className="font-bold block text-[10px] uppercase text-rose-700">Rejection Explanation:</span>
                        {req.rejection_reason}
                      </div>
                    )}
                  </div>
                )}

                {req.status === 'COMPLETED' && (
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                    <span className="font-bold text-teal-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-700" /> COMPLETED & REFUNDED
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Requested on: {new Date(req.requested_at).toLocaleString()}</span>
                  {req.processed_at && (
                    <span>Processed on: {new Date(req.processed_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReturnRequestModal
        isOpen={!!selectedOrderForReturn}
        onClose={() => setSelectedOrderForReturn(null)}
        order={selectedOrderForReturn}
        existingRequests={requests}
        onSuccess={fetchData}
      />
    </div>
  );
};


