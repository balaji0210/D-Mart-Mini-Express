import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Package, Calendar, X, Check } from 'lucide-react';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'SLOT' | 'SYSTEM';
  read: boolean;
  timestamp: string;
  link?: string;
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n1',
    title: 'Order Confirmed',
    message: 'Order #DM-10042 has been confirmed by staff.',
    type: 'ORDER',
    read: false,
    timestamp: '10 mins ago',
    link: '/orders'
  },
  {
    id: 'n2',
    title: 'Pickup Slot Reminder',
    message: 'Your pickup slot today is scheduled for 4:00 PM - 5:00 PM.',
    type: 'SLOT',
    read: false,
    timestamp: '1 hour ago',
    link: '/orders'
  },
  {
    id: 'n3',
    title: 'Low Stock Alert',
    message: 'Fresh Whole Milk stock has fallen below threshold (4 units remaining).',
    type: 'STOCK',
    read: true,
    timestamp: '3 hours ago',
    link: '/admin/inventory'
  }
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-4 h-4 text-teal-600" />;
      case 'STOCK':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'SLOT':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-teal-500 text-slate-950 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Recent Activity</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No notifications</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                  !n.read ? 'bg-teal-50/50' : ''
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
                    <span className="text-[11px] text-slate-400 ml-2 whitespace-nowrap">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button onClick={onClose} className="text-xs font-semibold text-slate-600 hover:text-slate-900">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
