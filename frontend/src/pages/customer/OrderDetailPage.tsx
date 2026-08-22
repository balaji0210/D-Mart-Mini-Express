import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Ban, RefreshCw, CheckCircle2, Clock, Download, Printer, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders';
import { returnsApi } from '../../api/returns';
import { Order, OrderItem, ReturnExchangeRequest } from '../../types/order';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { ReturnRequestModal } from '../../components/customer/ReturnRequestModal';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [returnRequests, setReturnRequests] = useState<ReturnExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Return request modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState<OrderItem | null>(null);

  const fetchOrderAndReturns = async () => {
    if (!id) return;
    try {
      const [orderRes, returnsRes] = await Promise.allSettled([
        ordersApi.getOrderDetail(id),
        returnsApi.getRequests(),
      ]);

      if (orderRes.status === 'fulfilled' && orderRes.value.data) {
        setOrder(orderRes.value.data.order || orderRes.value.data);
      }
      if (returnsRes.status === 'fulfilled' && returnsRes.value.data) {
        const reqs = returnsRes.value.data.data || returnsRes.value.data;
        setReturnRequests(Array.isArray(reqs) ? reqs : []);
      }
    } catch (err) {
      console.error('Failed to load order detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderAndReturns();
  }, [id]);

  const handleConfirmCancelOrder = async () => {
    if (!order) return;
    try {
      await ordersApi.cancelOrder(order.id);
      toast.success('Order cancelled successfully.');
      setOrder((prev) => (prev ? { ...prev, status: 'CANCELLED' } : null));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelModalOpen(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="dmart-card p-8 animate-pulse h-96"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order Record Not Found</h2>
        <Link to="/orders" className="btn-secondary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const timelineSteps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
  const currentStepIndex = timelineSteps.indexOf(order.status);
  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const canReturn = order.status === 'COMPLETED' || order.status === 'DELIVERED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <div className="flex items-center gap-2">
          {canReturn && (
            <button
              onClick={() => {
                setSelectedReturnItem(null);
                setIsReturnModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Request Return & Refund
            </button>
          )}
          <button onClick={printInvoice} className="btn-secondary py-1.5 px-3 text-xs">
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
        </div>
      </div>

      <div className="dmart-card p-6 sm:p-8 space-y-8">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 font-mono">#{order.order_number}</h1>
              <span className="badge-info">{order.status}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>

          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="btn-outline-danger py-2 px-4 text-xs"
            >
              <Ban className="w-4 h-4" /> Cancel Order
            </button>
          )}
        </div>

        {/* Timeline Progression */}
        {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fulfillment Status Progression</h3>
            <div className="grid grid-cols-5 gap-2 pt-2">
              {timelineSteps.map((step, idx) => {
                const isDone = currentStepIndex >= idx;
                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                        isDone ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Store Pickup Location */}
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1 text-teal-900">
          <div className="flex items-center gap-2 font-bold text-sm text-teal-950">
            <Store className="w-4 h-4 text-teal-700" /> Store Pickup Location: Mini D-Mart Express Mumbai Central
          </div>
          <p className="text-slate-600">Please present your Order ID #{order.order_number} to staff at the pickup desk.</p>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Order Items & Return / Refund Status</h3>
            {canReturn && (
              <span className="text-[11px] text-teal-700 font-medium">Eligible for 7-day return & refund</span>
            )}
          </div>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {order.items.map((item) => {
              const itemReq = returnRequests.find((r) => r.order_item?.id === item.id);
              
              // Custom container styling based on return request status
              let rowBg = '';
              if (itemReq) {
                if (itemReq.status === 'APPROVED') rowBg = 'bg-emerald-50/60 border-l-4 border-l-emerald-500';
                else if (itemReq.status === 'REQUESTED') rowBg = 'bg-amber-50/60 border-l-4 border-l-amber-500';
                else if (itemReq.status === 'REJECTED') rowBg = 'bg-rose-50/60 border-l-4 border-l-rose-500';
                else if (itemReq.status === 'COMPLETED') rowBg = 'bg-teal-50/60 border-l-4 border-l-teal-600';
              }

              return (
                <div key={item.id} className={`p-4 transition ${rowBg}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-extrabold text-slate-900 text-sm">{item.product_name}</p>
                        {itemReq && <StatusBadge status={itemReq.status} />}
                      </div>
                      <p className="text-slate-500 mt-0.5">{item.quantity} x ₹{Number(item.unit_price).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <span className="font-extrabold text-slate-900 text-sm">₹{Number(item.subtotal).toFixed(2)}</span>
                      {canReturn && !itemReq && (
                        <button
                          onClick={() => {
                            setSelectedReturnItem(item);
                            setIsReturnModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Request Return / Refund
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Prominent Return Status Callout Box */}
                  {itemReq && (
                    <div className="mt-3 p-3 rounded-xl text-xs space-y-1.5 border shadow-xs">
                      {itemReq.status === 'APPROVED' && (
                        <div className="bg-emerald-500/10 border-emerald-500/30 text-emerald-800 p-2.5 rounded-lg flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-emerald-950">Return & Refund Request ACCEPTED / APPROVED by Staff!</p>
                            <p className="text-emerald-800 text-[11px] mt-0.5">
                              Option: <span className="font-semibold uppercase">{itemReq.request_type}</span> • Reason: "{itemReq.reason}"
                            </p>
                            <p className="text-[10px] text-emerald-700 mt-0.5">Please bring the item to the store desk or hand over to pickup staff for final refund credit.</p>
                          </div>
                        </div>
                      )}

                      {itemReq.status === 'REQUESTED' && (
                        <div className="bg-amber-500/10 border-amber-500/30 text-amber-900 p-2.5 rounded-lg flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-amber-950">Return & Refund Request Submitted (Pending Staff Review)</p>
                            <p className="text-amber-800 text-[11px] mt-0.5">
                              Option: <span className="font-semibold uppercase">{itemReq.request_type}</span> • Reason: "{itemReq.reason}"
                            </p>
                          </div>
                        </div>
                      )}

                      {itemReq.status === 'REJECTED' && (
                        <div className="bg-rose-500/10 border-rose-500/30 text-rose-900 p-2.5 rounded-lg space-y-1">
                          <p className="font-bold text-rose-950 flex items-center gap-1.5">
                            ✕ Return Request REJECTED by Staff
                          </p>
                          <p className="text-rose-800 text-[11px]">Reason submitted: "{itemReq.reason}"</p>
                          {itemReq.rejection_reason && (
                            <div className="mt-1 p-2 rounded-md bg-white/80 border border-rose-200 text-rose-900 text-[11px]">
                              <span className="font-bold block text-[10px] uppercase text-rose-700">Staff Rejection Explanation:</span>
                              {itemReq.rejection_reason}
                            </div>
                          )}
                        </div>
                      )}

                      {itemReq.status === 'COMPLETED' && (
                        <div className="bg-teal-500/10 border-teal-500/30 text-teal-900 p-2.5 rounded-lg flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-teal-950">Return & Refund COMPLETED</p>
                            <p className="text-teal-800 text-[11px] mt-0.5">Item received and refund / replacement has been processed successfully.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-lg font-extrabold text-slate-900">
          <span>Grand Total</span>
          <span className="text-xl text-teal-800">₹{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? Reserved stock will be released back to inventory."
        confirmText="Confirm Cancellation"
        variant="danger"
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => setCancelModalOpen(false)}
      />

      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedReturnItem(null);
        }}
        order={order}
        selectedItem={selectedReturnItem}
        existingRequests={returnRequests}
        onSuccess={fetchOrderAndReturns}
      />
    </div>
  );
};

