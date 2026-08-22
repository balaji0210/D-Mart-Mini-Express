import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, ArrowRight, Store, Truck, RefreshCw, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders';
import { returnsApi } from '../../api/returns';
import { Order, ReturnExchangeRequest } from '../../types/order';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { ReturnRequestModal } from '../../components/customer/ReturnRequestModal';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; orderId: string | null }>({
    isOpen: false,
    orderId: null
  });

  // Return request modal state
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);

  const fetchOrdersAndReturns = async () => {
    try {
      const [ordersRes, returnsRes] = await Promise.allSettled([
        ordersApi.getOrders(),
        returnsApi.getRequests(),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
        const orderList = Array.isArray(ordersRes.value.data.orders)
          ? ordersRes.value.data.orders
          : Array.isArray(ordersRes.value.data)
          ? ordersRes.value.data
          : Array.isArray(ordersRes.value.data.results?.orders)
          ? ordersRes.value.data.results.orders
          : [];
        setOrders(orderList);
      }

      if (returnsRes.status === 'fulfilled' && returnsRes.value.data) {
        const reqs = returnsRes.value.data.data || returnsRes.value.data;
        setReturnRequests(Array.isArray(reqs) ? reqs : []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndReturns();
  }, []);

  const handleConfirmCancelOrder = async () => {
    if (!cancelModal.orderId) return;
    try {
      await ordersApi.cancelOrder(cancelModal.orderId);
      toast.success('Order cancelled successfully.');
      setOrders((prev) => prev.map((o) => (o.id === cancelModal.orderId ? { ...o, status: 'CANCELLED' } : o)));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelModal({ isOpen: false, orderId: null });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge-success">COMPLETED</span>;
      case 'DELIVERED':
        return <span className="badge-success font-bold">DELIVERED</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge-info">READY FOR PICKUP</span>;
      case 'PREPARING':
        return <span className="badge-warning">PREPARING</span>;
      case 'CANCELLED':
        return <span className="badge-danger">CANCELLED</span>;
      default:
        return <span className="badge-neutral">PENDING</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Orders & Pickup History</h1>
        <p className="text-slate-500 text-xs mt-0.5">Track active order status, initiate returns & refunds, or view details</p>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : orders.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-4">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
          <p className="text-slate-500 text-xs">You haven't placed any grocery pickup orders yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
            const canReturn = order.status === 'COMPLETED' || order.status === 'DELIVERED';
            
            // Check if any item in this order has a return request
            const orderReturnRequests = returnRequests.filter(
              (r) => order.items?.some((item) => item.id === r.order_item?.id)
            );
            const latestReturnStatus = orderReturnRequests[0]?.status;

            return (
              <div
                key={order.id}
                className="dmart-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dmart-card-hover"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base font-extrabold text-slate-900 font-mono">#{order.order_number}</span>
                    {getStatusBadge(order.status)}
                    {latestReturnStatus && (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-500">Return Status:</span>
                        <StatusBadge status={latestReturnStatus} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-teal-600" /> Express Store Pickup
                    </span>
                    <span>•</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{order.items_count} Items</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 flex-wrap">
                  <span className="text-lg font-extrabold text-teal-800 mr-2">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </span>
                  {canCancel && (
                    <button
                      onClick={() => setCancelModal({ isOpen: true, orderId: order.id })}
                      className="btn-outline-danger py-1.5 px-3 text-xs"
                    >
                      Cancel Order
                    </button>
                  )}
                  {canReturn && (
                    <button
                      onClick={() => setReturnModalOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Return / Refund
                    </button>
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    View Timeline <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={cancelModal.isOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? Stock will be released back to inventory."
        confirmText="Confirm Cancellation"
        variant="danger"
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => setCancelModal({ isOpen: false, orderId: null })}
      />

      <ReturnRequestModal
        isOpen={!!returnModalOrder}
        onClose={() => setReturnModalOrder(null)}
        order={returnModalOrder}
        existingRequests={returnRequests}
        onSuccess={fetchOrdersAndReturns}
      />
    </div>
  );
};

