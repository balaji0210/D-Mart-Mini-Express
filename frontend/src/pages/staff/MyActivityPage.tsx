import React from 'react';
import { Activity, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StaffMyActivityPage: React.FC = () => {
  const { user } = useAuth();

  const activities = [
    { id: 1, action: 'Marked Order #DM-10042 as Ready for Pickup', time: '14:20 PM' },
    { id: 2, action: 'Started Preparation for Order #DM-10043', time: '13:45 PM' },
    { id: 3, action: 'Confirmed Order #DM-10045', time: '12:10 PM' },
    { id: 4, action: 'Reported low stock count for Organic Bananas', time: '10:30 AM' }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-teal-600" /> Staff Activity Log
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Fulfillment record for {user?.full_name || 'Staff Member'}
        </p>
      </div>

      <div className="dmart-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Shift Fulfillment History</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {activities.map(a => (
            <div key={a.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">{a.action}</span>
              </div>
              <span className="text-slate-400 font-mono">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
