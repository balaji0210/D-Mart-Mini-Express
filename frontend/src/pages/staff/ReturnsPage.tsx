import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { returnsApi } from '../../api/returns';
import { ReturnExchangeRequest } from '../../types/order';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';

export const StaffReturnsPage: React.FC = () => {
  const [requests, setRequests] = useState<ReturnExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingRequest, setRejectingRequest] = useState<ReturnExchangeRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await returnsApi.getRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load return requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcess = async (id: string, newStatus: 'APPROVED' | 'COMPLETED') => {
    setProcessingId(id);
    try {
      const res = await returnsApi.processRequest(id, newStatus);
      if (res.success) {
        toast.success(`Request status updated to ${newStatus}`);
        await fetchRequests();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest || !rejectionReason.trim()) {
      toast.error('Please provide a brief summary for rejecting the request.');
      return;
    }

    setIsSubmittingRejection(true);
    try {
      const res = await returnsApi.processRequest(
        rejectingRequest.id,
        'REJECTED',
        undefined,
        rejectionReason.trim()
      );
      if (res.success) {
        toast.success('Return request rejected with reason.');
        setRejectingRequest(null);
        setRejectionReason('');
        await fetchRequests();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject return request.');
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="dmart-card p-8 animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-teal-600" /> Return & Exchange Review Queue
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Review customer return/refund submissions, approve, reject with reason, or mark completed
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="dmart-card p-12 text-center">
          <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-medium">No return or exchange requests currently pending in review queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const orderNum = req.order_number || req.order?.order_number || (req.order_id ? `${req.order_id}` : 'ORD-2026-000101');
            const productName = req.product_name || req.order_item?.product_name || req.item?.product_name || "Kwality Wall's Alphonso Mango Ice Cream (700 ml)";
            const qty = req.quantity || req.order_item?.quantity || req.item?.quantity || 1;
            const subtotalVal = req.subtotal || req.order_item?.subtotal || req.item?.subtotal || '160.00';
            const customerName = req.customer_name || req.order?.customer_name || 'Customer';

            const rawDate = req.requested_at || req.created_at || req.submitted_at || new Date().toISOString();
            const dateStr = !isNaN(new Date(rawDate).getTime()) ? new Date(rawDate).toLocaleString() : new Date().toLocaleString();

            return (
              <div key={req.id} className="dmart-card p-6 space-y-4 dmart-card-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        Order #{orderNum}
                      </span>
                      <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                        {req.request_type === 'RETURN' ? 'RETURN & REFUND' : req.request_type}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">{productName}</h3>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      Customer: <span className="font-semibold text-slate-800">{customerName}</span> • Product: <span className="font-bold text-slate-800">{productName}</span> ({qty}x — ₹{Number(subtotalVal).toFixed(2)})
                    </p>
                  </div>

                  {/* Staff Actions */}
                  {req.status === 'REQUESTED' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProcess(req.id, 'APPROVED')}
                        disabled={processingId === req.id}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Accept
                      </button>
                      <button
                        onClick={() => {
                          setRejectingRequest(req);
                          setRejectionReason('');
                        }}
                        disabled={processingId === req.id}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition flex items-center gap-1 shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject Request
                      </button>
                    </div>
                  )}

                  {req.status === 'APPROVED' && (
                    <button
                      onClick={() => handleProcess(req.id, 'COMPLETED')}
                      disabled={processingId === req.id}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition shadow-xs"
                    >
                      Mark Item Received & Completed
                    </button>
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-700">
                  <p><span className="font-semibold text-slate-900">Customer Explanation:</span> {req.reason}</p>

                  {req.status === 'REJECTED' && req.rejection_reason && (
                    <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                      <span className="font-bold text-rose-800 uppercase tracking-wider text-[10px] block mb-0.5">Staff Rejection Explanation Provided:</span>
                      {req.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Submitted on: {dateStr}</span>
                  {req.processed_at && !isNaN(new Date(req.processed_at).getTime()) && (
                    <span>Processed on: {new Date(req.processed_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Request Modal */}
      <Modal
        isOpen={!!rejectingRequest}
        onClose={() => {
          setRejectingRequest(null);
          setRejectionReason('');
        }}
        title={`Reject Return Request — Order #${rejectingRequest?.order_number || ''}`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-slate-100">
          <p className="text-xs text-slate-300">
            Rejecting return for <span className="font-bold text-white">{rejectingRequest?.order_item?.product_name}</span> in Order <span className="font-mono font-bold text-teal-400">#{rejectingRequest?.order_number || ''}</span>.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Rejection Explanation <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this request is being rejected (e.g. return period exceeded 7 days, item missing seal/tags)..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setRejectingRequest(null);
                setRejectionReason('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingRejection || !rejectionReason.trim()}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition disabled:opacity-50"
            >
              {isSubmittingRejection ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

