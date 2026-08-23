import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardList, Search, Download, Eye, CheckCircle, CreditCard, DollarSign, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { apiClient } from '../../api/client';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'CANCEL' | 'REFUND' | 'STATUS';
    targetStatus?: OrderStatus;
  }>({
    isOpen: false,
    action: 'STATUS'
  });
  const [actionReason, setActionReason] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      const rawData = res.data || res;
      const orderList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.orders)
        ? rawData.orders
        : Array.isArray(res.orders)
        ? res.orders
        : [];
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        o.order_number.toLowerCase().includes(q) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || o.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success || res.data) {
        toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    try {
      const res = await adminApi.updatePaymentStatus(orderId, newPaymentStatus);
      if (res.success || res.data) {
        toast.success(`Payment marked as ${newPaymentStatus}`);
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => (prev ? { ...prev, payment_status: newPaymentStatus } : null));
        }
      }
    } catch (err: any) {
      toast.error('Failed to update payment status.');
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder) return;

    if (confirmModal.action === 'CANCEL') {
      try {
        const res = await adminApi.cancelOrder(selectedOrder.id, actionReason);
        if (res.success || res.data) {
          toast.success('Order cancelled successfully.');
          await fetchOrders();
          setSelectedOrder(null);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel order.');
      }
    } else if (confirmModal.action === 'REFUND') {
      try {
        const amountNum = Number(selectedOrder.total_amount || 0);
        const res = await adminApi.processRefund(selectedOrder.id, amountNum, actionReason || 'Admin issued refund');
        if (res.success || res.data) {
          toast.success(res.message || 'Refund processed successfully.');
          await fetchOrders();
          setSelectedOrder(null);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to process refund.');
      }
    }


    setConfirmModal({ isOpen: false, action: 'STATUS' });
    setActionReason('');
  };

  const exportCSV = () => {
    const headers = ['Order Number,Customer,Items Count,Total Amount,Payment Status,Order Status,Created At'];
    const rows = filteredOrders.map(
      o => `"${o.order_number}","${o.customer_name || 'Customer'}","${o.items_count}","₹${o.total_amount}","${o.payment_status}","${o.status}","${o.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `minidmart_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV');
  };

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
      case 'CANCELLED':
      case 'REFUNDED':
        return <span className="badge-danger">{status}</span>;
      default:
        return <span className="badge-warning">PENDING</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return <span className="badge-success">PAID</span>;
      case 'FAILED':
      case 'REFUNDED':
        return <span className="badge-danger">{status}</span>;
      default:
        return <span className="badge-warning">UNPAID</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-600" /> Order Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Track customer pickup orders, collect counter payments, and manage fulfillment workflow
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="dmart-card p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Name or Email..."
            className="dmart-input pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Order Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="dmart-select w-36"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="dmart-select w-32"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Unpaid</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredOrders.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No orders matching your search or filters.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 font-mono text-xs">
                      #{order.order_number}
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-800">
                      {order.customer_name || order.customer?.full_name || 'Guest Customer'}
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">
                      {order.items_count} items
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      ₹{typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : order.total_amount}
                    </td>
                    <td className="p-4">{getPaymentBadge(order.payment_status || 'PENDING')}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      {order.payment_status !== 'PAID' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(order.id, 'PAID')}
                          className="btn-secondary py-1 px-2.5 text-xs text-emerald-800 font-bold bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-secondary py-1 px-3 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Customer Order Details</span>
                <h3 className="text-xl font-extrabold text-slate-900">#{selectedOrder.order_number}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedOrder.status)}
                {getPaymentBadge(selectedOrder.payment_status || 'PENDING')}
              </div>
            </div>

            {/* Payment Quick Control Bar */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span className="font-semibold text-slate-700">Payment Status:</span>
                <span className="font-extrabold text-teal-900 uppercase">
                  {selectedOrder.payment_status || 'UNPAID'} ({selectedOrder.payment_method || 'CASH ON PICKUP'})
                </span>
              </div>
              {selectedOrder.payment_status !== 'PAID' ? (
                <button
                  onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'PAID')}
                  className="btn-primary py-1 px-3 text-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                </button>
              ) : (
                <span className="badge-success text-xs">Payment Complete</span>
              )}
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Checklist</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product_name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} x ₹{item.unit_price}</p>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-teal-700 font-extrabold text-base">₹{selectedOrder.total_amount}</span>
              </div>
            </div>

            {/* Status Transition Action Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Change Fulfillment Status</h4>
              {selectedOrder.status === 'COMPLETED' ? (
                <div className="flex items-center gap-2">
                  <span className="badge-success text-xs py-1.5 px-3">Order Completed</span>
                  <span className="text-xs text-slate-500">This order has been fulfilled and completed.</span>
                </div>
              ) : selectedOrder.status === 'CANCELLED' ? (
                <div className="flex items-center gap-2">
                  <span className="badge-danger text-xs py-1.5 px-3">Order Cancelled</span>
                  <span className="text-xs text-slate-500">This order was cancelled and inventory stock released.</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      Confirm Order
                    </button>
                  )}
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'PREPARING')}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      Start Preparing
                    </button>
                  )}
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'CONFIRMED' || selectedOrder.status === 'PREPARING') && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'READY_FOR_PICKUP')}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm"
                  >
                    Complete Pickup Order
                  </button>
                </div>
              )}
            </div>

            {/* Destructive / Admin Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmModal({ isOpen: true, action: 'CANCEL' })}
                  className="btn-outline-danger py-1.5 px-3 text-xs"
                >
                  <Ban className="w-3.5 h-3.5" /> Cancel Order
                </button>
                {selectedOrder.payment_status !== 'REFUNDED' && (
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, action: 'REFUND' })}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Issue Refund
                  </button>
                )}

              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'CANCEL' ? 'Cancel Order' : 'Process Refund'}
        message={`Are you sure you want to ${confirmModal.action === 'CANCEL' ? 'cancel' : 'refund'} order #${selectedOrder?.order_number}?`}
        confirmText={confirmModal.action === 'CANCEL' ? 'Confirm Cancellation' : 'Process Full Refund'}
        variant={confirmModal.action === 'CANCEL' ? 'danger' : 'warning'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: 'STATUS' })}
      />
    </div>
  );
};
