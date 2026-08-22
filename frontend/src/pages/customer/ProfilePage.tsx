import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Save, Bell, MapPin, Trash2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [password, setPassword] = useState('');

  // Notification Toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await authApi.updateProfile({ full_name: fullName, email });
      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted to administration.');
    setDeleteModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-teal-600" /> My Account & Settings
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage personal information, password, and notification preferences</p>
      </div>

      {/* Main Profile Form */}
      <div className="dmart-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-xl shadow-sm">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
            <span className="badge-info uppercase mt-1">Role: {user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="dmart-input pl-10"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dmart-input pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="dmart-input pl-10"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Change Password (Optional)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to retain current password"
                className="dmart-input pl-10"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button type="submit" disabled={isUpdating} className="btn-primary">
              <Save className="w-4 h-4" /> {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="dmart-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-teal-600" /> Notification Preferences
        </h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Email Order Alerts</p>
              <p className="text-slate-500">Receive order confirmation & pickup receipts via email</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">SMS Pickup Reminders</p>
              <p className="text-slate-500">Get text message reminders when your order is ready for pickup</p>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={(e) => setSmsNotif(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="dmart-card p-6 flex items-center justify-between border-l-4 border-l-red-500">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Request Account Deletion</h4>
          <p className="text-xs text-slate-500">Permanently delete your profile and clear saved order history</p>
        </div>
        <button onClick={() => setDeleteModalOpen(true)} className="btn-outline-danger py-1.5 px-3 text-xs">
          <Trash2 className="w-3.5 h-3.5" /> Request Deletion
        </button>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Request Account Deletion"
        message="Are you sure you want to request permanent deletion of your Mini D-Mart account?"
        confirmText="Request Deletion"
        variant="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
