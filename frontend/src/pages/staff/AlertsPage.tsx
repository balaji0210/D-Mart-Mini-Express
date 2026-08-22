import React from 'react';
import { BellRing, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export const StaffAlertsPage: React.FC = () => {
  const alerts = [
    { id: 1, title: 'Urgent Pickup Imminent', message: 'Order #DM-10042 pickup window starts in 15 minutes. Ensure order is marked Ready.', time: '10 mins ago', priority: 'HIGH' },
    { id: 2, title: 'Low Stock Threshold Reached', message: 'Fresh Whole Milk has 4 units remaining. Please report to store manager.', time: '1 hour ago', priority: 'MEDIUM' },
    { id: 3, title: 'Customer Cancellation Request', message: 'Order #DM-10038 was cancelled by customer. Do not pack items.', time: '2 hours ago', priority: 'HIGH' }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BellRing className="w-6 h-6 text-teal-600" /> Operational Alerts & Feed
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Real-time alerts for urgent pickup schedules, cancellation notices, and inventory warnings
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="dmart-card p-4 flex items-start gap-4">
            <div className={`p-2.5 rounded-xl mt-0.5 ${a.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{a.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
