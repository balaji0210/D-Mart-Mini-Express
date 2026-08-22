import React, { useState, useEffect, useMemo } from 'react';
import { UserCheck, Plus, Search, ShieldCheck, Mail, Calendar, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { User } from '../../types/auth';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const AdminStaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; staff: User | null }>({
    isOpen: false,
    staff: null
  });

  const fetchStaff = async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.success && res.data) {
        const staffOnly = res.data.filter((u: User) => u.role === 'STAFF' || u.role === 'ADMIN');
        setStaffList(staffOnly);
      }
    } catch (err) {
      console.error('Failed to load staff accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchTerm.toLowerCase();
      return s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    });
  }, [staffList, searchTerm]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await adminApi.createStaff({
        email,
        full_name: fullName,
        password,
        role,
      });
      if (res.success) {
        toast.success(`Staff account created for ${fullName}!`);
        setModalOpen(false);
        setFullName('');
        setEmail('');
        setPassword('');
        await fetchStaff();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmToggleActive = async () => {
    if (!confirmModal.staff) return;
    const user = confirmModal.staff;
    try {
      const res = await adminApi.toggleUserActive(user.id);
      if (res.success) {
        toast.success(res.message || 'Staff status updated');
        await fetchStaff();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update account status.');
    } finally {
      setConfirmModal({ isOpen: false, staff: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-teal-600" /> Staff & Role Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage staff accounts, assign operational roles, and set access permissions
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dmart-card p-4">
        <div className="relative max-w-md w-full flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff members by name or email..."
            className="dmart-input pl-10"
          />
        </div>
      </div>


      {/* Table Content */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredStaff.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No staff accounts found.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role Permission</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-teal-400 font-bold flex items-center justify-center text-xs border border-slate-700">
                          {staff.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{staff.full_name}</p>
                          <p className="text-xs text-slate-400 font-mono">ID: {staff.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600">{staff.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                        staff.role === 'ADMIN'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {staff.is_active !== false ? (
                        <span className="badge-success">ACTIVE</span>
                      ) : (
                        <span className="badge-danger">DEACTIVATED</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, staff })}
                        className={staff.is_active !== false ? 'btn-outline-danger py-1 px-3 text-xs' : 'btn-primary py-1 px-3 text-xs'}
                      >
                        {staff.is_active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Staff Member</h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Staff"
                  className="dmart-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@minidmart.com"
                  className="dmart-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="dmart-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'STAFF' | 'ADMIN')}
                  className="dmart-select"
                >
                  <option value="STAFF">Staff (Order & Pickup Fulfillment)</option>
                  <option value="ADMIN">Admin (Full Control & Reports)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.staff?.is_active !== false ? 'Deactivate Staff Account' : 'Activate Staff Account'}
        message={`Are you sure you want to ${confirmModal.staff?.is_active !== false ? 'deactivate' : 'activate'} account for ${confirmModal.staff?.full_name}?`}
        confirmText={confirmModal.staff?.is_active !== false ? 'Deactivate' : 'Activate'}
        variant={confirmModal.staff?.is_active !== false ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setConfirmModal({ isOpen: false, staff: null })}
      />
    </div>
  );
};
