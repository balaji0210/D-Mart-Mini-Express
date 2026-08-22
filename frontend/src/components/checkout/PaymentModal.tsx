import React, { useState } from 'react';
import { DollarSign, ShieldCheck, X, Store } from 'lucide-react';
import { PaymentMethod } from '../../types/order';

interface PaymentModalProps {
  isOpen: boolean;
  totalAmount: number;
  onClose: () => void;
  onPaymentSuccess: (method: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  totalAmount,
  onClose,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess('CASH');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-lg">Store Pickup Payment Option</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Total Payable Amount:</span>
          <span className="text-xl font-extrabold text-teal-800">₹{totalAmount.toFixed(2)}</span>
        </div>

        {/* Exclusive Pay Cash at Store Pickup Option */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/50 ring-2 ring-teal-500 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0 mt-0.5">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900">Pay Cash at Store Pickup</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Reserve your order now and pay directly with Cash or UPI when collecting your grocery items at the Mini D-Mart pickup desk.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="btn-primary w-full py-3.5 text-sm"
          >
            {isProcessing ? 'Reserving Pickup Order...' : 'Confirm Pickup Order (Pay Cash at Store)'}
          </button>
        </div>
      </div>
    </div>
  );
};
