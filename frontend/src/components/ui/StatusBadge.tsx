import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'PENDING':
      case 'REQUESTED':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'CONFIRMED':
      case 'PREPARING':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'READY_FOR_PICKUP':
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
      case 'COMPLETED':
      case 'DELIVERED':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30 font-bold';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  const getStatusText = (st: string) => {
    switch (st.toUpperCase()) {
      case 'REQUESTED':
        return 'RETURN REQUESTED (PENDING)';
      case 'APPROVED':
        return 'RETURN ACCEPTED (APPROVED)';
      case 'REJECTED':
        return 'RETURN REJECTED';
      case 'COMPLETED':
        return 'RETURN & REFUND COMPLETED';
      default:
        return st.replace(/_/g, ' ');
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
};

