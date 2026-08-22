import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, FolderTree, Users, PackageCheck, CalendarClock,
  FileText, ClipboardList, UserCheck, CreditCard, BarChart3, Settings, ShieldAlert,
  Activity, User, BellRing, Boxes, RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const staffLinks = [
    { to: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/staff/orders', label: 'Orders Queue', icon: ClipboardList },
    { to: '/staff/pickup-queue', label: 'Pickup Queue', icon: CalendarClock },
    { to: '/staff/returns', label: 'Returns & Refunds', icon: RotateCcw },
    { to: '/staff/inventory-updates', label: 'Inventory Updates', icon: Boxes },
    { to: '/staff/alerts', label: 'Operational Alerts', icon: BellRing },
    { to: '/staff/my-activity', label: 'My Activity', icon: Activity },
    { to: '/staff/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/inventory', label: 'Inventory & Alerts', icon: ShieldAlert },
    { to: '/admin/pickup-slots', label: 'Pickup Slots', icon: CalendarClock },
    { to: '/admin/orders', label: 'Orders Management', icon: ClipboardList },
    { to: '/staff/returns', label: 'Returns & Refunds', icon: RotateCcw },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/staff', label: 'Staff Management', icon: UserCheck },
    { to: '/admin/payments', label: 'Payments & Refunds', icon: CreditCard },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : staffLinks;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4 shrink-0 text-slate-300 hidden md:block">
      {/* Role Banner */}
      <div className="mb-5 px-3.5 py-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Workspace</p>
          <p className="text-xs font-extrabold text-teal-400 uppercase mt-0.5 tracking-wide">
            {user?.role} PORTAL
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
      </div>

      {/* Sidebar Links */}
      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/staff'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
