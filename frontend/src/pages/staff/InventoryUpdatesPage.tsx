import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const StaffInventoryUpdatesPage: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [reason, setReason] = useState('DAMAGED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Inventory adjustment report submitted for admin audit approval!');
      setProductName('');
      setCurrentStock('');
      setNotes('');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-teal-600" /> Inventory Stock Reporting
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Report damaged items, missing items, or low stock warnings directly to store administration
        </p>
      </div>

      <div className="dmart-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name / Barcode</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Fresh Farm Whole Milk 1L"
              className="dmart-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Observed Stock Count</label>
              <input
                type="number"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                placeholder="Remaining physical units"
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="dmart-select"
              >
                <option value="DAMAGED">Damaged / Expired Goods</option>
                <option value="MISSING">Discrepancy / Missing Stock</option>
                <option value="LOW_STOCK">Critical Low Stock Warning</option>
                <option value="RESTOCK">Manual Stock Replenishment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Staff Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Details on condition or shelf location..."
              className="dmart-input h-24"
            />
          </div>

          <div className="pt-2 text-right">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
