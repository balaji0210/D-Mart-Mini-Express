import React, { useState } from 'react';
import { CalendarClock, Clock, CheckCircle2, AlertTriangle, Users, ChevronRight } from 'lucide-react';

export const StaffPickupQueuePage: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>('slot-2');

  const slots = [
    {
      id: 'slot-1',
      time: '02:00 PM - 03:00 PM',
      status: 'COMPLETED',
      booked: 15,
      capacity: 15,
      orders: [
        { id: 'DM-10039', customer: 'Anil Gupta', status: 'COMPLETED', items: 6 },
        { id: 'DM-10040', customer: 'Suresh Kumar', status: 'COMPLETED', items: 4 }
      ]
    },
    {
      id: 'slot-2',
      time: '04:00 PM - 05:00 PM',
      status: 'ACTIVE',
      booked: 12,
      capacity: 15,
      orders: [
        { id: 'DM-10042', customer: 'Rahul Sharma', status: 'READY_FOR_PICKUP', items: 5 },
        { id: 'DM-10043', customer: 'Priya Patel', status: 'PREPARING', items: 8 },
        { id: 'DM-10045', customer: 'Vikas Shah', status: 'CONFIRMED', items: 3 }
      ]
    },
    {
      id: 'slot-3',
      time: '05:00 PM - 06:00 PM',
      status: 'UPCOMING',
      booked: 8,
      capacity: 15,
      orders: [
        { id: 'DM-10046', customer: 'Anita Roy', status: 'PENDING', items: 7 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-teal-600" /> Today's Pickup Schedule & Queue
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Identify customer orders scheduled by pickup time slot to prioritize order preparation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slot Selection Column */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Slots Today</h3>
          {slots.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedSlot(s.id)}
              className={`dmart-card p-4 cursor-pointer transition-all ${
                selectedSlot === s.id
                  ? 'border-2 border-teal-500 shadow-md bg-teal-50/20'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" /> {s.time}
                </span>
                {s.status === 'ACTIVE' && <span className="badge-info">ACTIVE NOW</span>}
                {s.status === 'COMPLETED' && <span className="badge-neutral">DONE</span>}
                {s.status === 'UPCOMING' && <span className="badge-warning">UPCOMING</span>}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{s.booked} of {s.capacity} orders booked</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Orders in Selected Slot Column */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Orders in Selected Slot ({slots.find(s => s.id === selectedSlot)?.time || 'Slot'})
          </h3>

          <div className="space-y-3">
            {slots
              .find(s => s.id === selectedSlot)
              ?.orders.map(o => (
                <div key={o.id} className="dmart-card p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 font-mono text-sm">#{o.id}</span>
                      <span className="badge-info">{o.status}</span>
                    </div>
                    <p className="text-slate-600 mt-1 font-medium">Customer: {o.customer} ({o.items} items)</p>
                  </div>
                  <span className="font-semibold text-teal-700">Needs Prep</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
