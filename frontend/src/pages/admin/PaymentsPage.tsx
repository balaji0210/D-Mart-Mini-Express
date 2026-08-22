import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, Search, Download, RefreshCw, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { Order, PaymentStatus } from '../../types/order';

export const AdminPaymentsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [confirmRefundModal, setConfirmRefundModal] = useState(false);
  const [refundNotes, setRefundNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.error('Failed to load payment transactions:', err);
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

      const payStatus = o.payment_status || 'PENDING';
      const matchesStatus = statusFilter === 'ALL' || payStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    let totalSettled = 0;
    let pendingAmount = 0;
    let refundsAmount = 0;

    orders.forEach(o => {
      const amt = Number(o.total_amount || 0);
      const status = o.payment_status || 'PENDING';
      if (status === 'PAID') totalSettled += amt;
      else if (status === 'PENDING') pendingAmount += amt;
      else if (status === 'REFUNDED') refundsAmount += amt;
    });

    return { totalSettled, pendingAmount, refundsAmount };
  }, [orders]);

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      const amountNum = Number(selectedOrder.total_amount || 0);
      const res = await adminApi.processRefund(selectedOrder.id, amountNum, refundNotes || 'Admin processed refund');
      toast.success(res.message || `Refund of ₹${amountNum.toFixed(2)} issued for order #${selectedOrder.order_number}`);
      await fetchOrders();
      setConfirmRefundModal(false);
      setSelectedOrder(null);
      setRefundNotes('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Order Number,Customer Name,Payment Method,Total Amount,Payment Status,Date'];
    const rows = filteredOrders.map(
      o => `"${o.order_number}","${o.customer_name || 'Customer'}","${o.payment_method || 'CASH'}","₹${o.total_amount}","${o.payment_status || 'PENDING'}","${new Date(o.created_at).toLocaleString()}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `minidmart_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payments report exported to CSV');
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return <span className="badge-success">PAID</span>;
      case 'REFUNDED':
        return <span className="badge-danger font-semibold">REFUNDED</span>;
      case 'FAILED':
        return <span className="badge-danger">FAILED</span>;
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
            <CreditCard className="w-6 h-6 text-teal-600" /> Payments & Refunds
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Monitor real-time payment transactions, store settlements, and process customer refunds
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dmart-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Settled Revenue</p>
            <p className="text-xl font-extrabold text-slate-900">₹{stats.totalSettled.toFixed(2)}</p>
          </div>
        </div>

        <div className="dmart-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Unpaid Counter Orders</p>
            <p className="text-xl font-extrabold text-slate-900">₹{stats.pendingAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="dmart-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-100 text-red-700">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Refunds Issued</p>
            <p className="text-xl font-extrabold text-slate-900">₹{stats.refundsAmount.toFixed(2)}</p>
          </div>
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
          <span className="text-xs font-semibold text-slate-500">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dmart-select w-36"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Unpaid</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredOrders.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No payment transactions match filters.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const payStatus = order.payment_status || 'PENDING';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-xs font-bold font-mono text-slate-900">#{order.order_number}</td>
                      <td className="p-4 text-xs font-semibold text-slate-800">
                        {order.customer_name || order.customer?.full_name || 'Customer'}
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600">
                        {order.payment_method || 'CASH ON PICKUP'}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="p-4">{getStatusBadge(payStatus)}</td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {payStatus !== 'REFUNDED' ? (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setConfirmRefundModal(true);
                            }}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold"
                          >
                            Issue Refund
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Refunded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {confirmRefundModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Process Refund for Order #{selectedOrder.order_number}</h3>
            <p className="text-xs text-slate-600">
              Amount to be refunded: <span className="font-extrabold text-teal-800 text-sm">₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Refund Notes</label>
              <textarea
                value={refundNotes}
                onChange={(e) => setRefundNotes(e.target.value)}
                placeholder="Reason for refunding..."
                className="dmart-input h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmRefundModal(false);
                  setSelectedOrder(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
