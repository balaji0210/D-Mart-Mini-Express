import React, { useState } from 'react';
import { Settings, Save, Store, Clock, DollarSign, ShieldAlert, Bell, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { StoreSettings } from '../../types/order';

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: 'Mini D-Mart Express',
  logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
  email: 'contact@minidmart.com',
  phone: '+91 98765 43210',
  address: 'Plot 42, Sector 15, Tech Park Road, Mumbai 400071',
  business_hours: '08:00 AM - 09:00 PM',
  timezone: 'Asia/Kolkata',
  currency_symbol: '₹',
  tax_rate: 5.0,
  cancellation_window_minutes: 30,
  auto_cancel_unclaimed_hours: 24,
  enable_cash_payment: true,
  enable_card_payment: true,
  enable_upi_payment: true,
  enable_wallet_payment: true,
};

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Store configuration settings saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" /> Admin Store Settings
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure store metadata, business timezone, tax rates, pickup rules, and payment gateways
          </p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          <Save className="w-4 h-4" /> {isSaving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-teal-600" /> Store Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Brand Name</label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Store Address</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="dmart-input"
              />
            </div>
          </div>
        </div>

        {/* Business Operating Rules & Timezone */}
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-teal-600" /> Operating Rules & Timezone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Operating Hours</label>
              <input
                type="text"
                value={settings.business_hours}
                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="dmart-select"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="dmart-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.tax_rate}
                onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Cancellation Window (mins)</label>
              <input
                type="number"
                value={settings.cancellation_window_minutes}
                onChange={(e) => setSettings({ ...settings, cancellation_window_minutes: parseInt(e.target.value) })}
                className="dmart-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unclaimed Order Cancel Limit (hours)</label>
              <input
                type="number"
                value={settings.auto_cancel_unclaimed_hours}
                onChange={(e) => setSettings({ ...settings, auto_cancel_unclaimed_hours: parseInt(e.target.value) })}
                className="dmart-input"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="dmart-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-teal-600" /> Payment Methods Supported
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_cash_payment}
                onChange={(e) => setSettings({ ...settings, enable_cash_payment: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Cash on Store Pickup</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_card_payment}
                onChange={(e) => setSettings({ ...settings, enable_card_payment: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Credit / Debit Card Gateway</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_upi_payment}
                onChange={(e) => setSettings({ ...settings, enable_upi_payment: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">UPI Instant Payment (GPay, PhonePe, Paytm)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_wallet_payment}
                onChange={(e) => setSettings({ ...settings, enable_wallet_payment: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Digital Wallet Payments</span>
            </label>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button type="submit" disabled={isSaving} className="btn-primary px-6 py-3">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Configuration Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
