import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ArrowLeftRight, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { returnsApi } from '../../api/returns';
import { Order, OrderItem, ReturnExchangeRequest } from '../../types/order';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  selectedItem?: OrderItem | null;
  existingRequests?: ReturnExchangeRequest[];
  onSuccess?: () => void;
}

const COMMON_REASONS = [
  'Defective or damaged product',
  'Received wrong item',
  'Expired product delivered',
  'Quality not as expected',
  'Item missing from package',
  'Other'
];

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  isOpen,
  onClose,
  order,
  selectedItem,
  existingRequests = [],
  onSuccess,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [requestType, setRequestType] = useState<'RETURN' | 'EXCHANGE'>('RETURN');
  const [reasonPreset, setReasonPreset] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter items that don't already have an active/completed return request
  const eligibleItems = (order?.items || []).filter((item) => {
    const existing = existingRequests.find(
      (r) => r.order_item?.id === item.id && ['REQUESTED', 'APPROVED', 'COMPLETED'].includes(r.status)
    );
    return !existing;
  });

  useEffect(() => {
    if (selectedItem) {
      setSelectedItemId(selectedItem.id);
    } else if (eligibleItems.length > 0) {
      setSelectedItemId(eligibleItems[0].id);
    } else {
      setSelectedItemId('');
    }
  }, [selectedItem, order, existingRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      toast.error('Please select an order item to return or refund.');
      return;
    }

    const finalReason =
      reasonPreset === 'Other'
        ? customReason.trim()
        : customReason.trim()
        ? `${reasonPreset}: ${customReason.trim()}`
        : reasonPreset;

    if (!finalReason) {
      toast.error('Please provide a reason for the return or refund.');
      return;
    }

    const targetItem = order?.items?.find((i) => i.id === selectedItemId);

    setIsSubmitting(true);
    try {
      const res = await returnsApi.createRequest({
        order_item_id: selectedItemId,
        request_type: requestType,
        reason: finalReason,
        order: order,
        item: targetItem,
      });

      if (res.success) {
        toast.success(
          requestType === 'RETURN'
            ? 'Return & Refund request submitted successfully.'
            : 'Exchange request submitted successfully.'
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || 'Failed to submit return request.');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.errors?.order_item_id?.[0] || 'Failed to submit request.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requestType === 'RETURN' ? 'Request Return & Refund' : 'Request Item Exchange'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-100">
        <p className="text-xs text-slate-300">
          Order <span className="font-mono font-bold text-teal-400">#{order?.order_number}</span> — Select an item and state the reason for return or refund.
        </p>

        {/* Request Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
            Request Option
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRequestType('RETURN')}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                requestType === 'RETURN'
                  ? 'bg-teal-600/20 border-teal-500 text-teal-300'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-teal-400" />
              <div className="text-left">
                <div>Return & Refund</div>
                <div className="text-[10px] font-normal text-slate-400">Get refund to original payment</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRequestType('EXCHANGE')}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                requestType === 'EXCHANGE'
                  ? 'bg-teal-600/20 border-teal-500 text-teal-300'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-teal-400" />
              <div className="text-left">
                <div>Item Exchange</div>
                <div className="text-[10px] font-normal text-slate-400">Replace with new product</div>
              </div>
            </button>
          </div>
        </div>

        {/* Select Order Item */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Select Product <span className="text-rose-400">*</span>
          </label>
          {eligibleItems.length === 0 ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>All items in this order already have active or completed return/exchange requests.</span>
            </div>
          ) : (
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            >
              {eligibleItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name} ({item.quantity}x — ₹{Number(item.subtotal).toFixed(2)})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Reason Preset Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Reason Category <span className="text-rose-400">*</span>
          </label>
          <select
            value={reasonPreset}
            onChange={(e) => setReasonPreset(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
          >
            {COMMON_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Reason Details */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Additional Details / Explanation {reasonPreset === 'Other' && <span className="text-rose-400">*</span>}
          </label>
          <textarea
            rows={3}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Describe the issue with the item (e.g. damaged packaging, expired date, wrong item)..."
            className="w-full p-2.5 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
          ></textarea>
        </div>

        {/* Policy Disclaimer */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-300 block">Return & Refund Policy:</span>
          <p>Returns and refunds are eligible within 7 days of delivery or pickup. Once approved by staff, refunds are credited back or replacement items prepared.</p>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || eligibleItems.length === 0}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
