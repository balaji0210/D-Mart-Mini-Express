import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Download, UserCheck, UserX, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { User } from '../../types/auth';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; customer: User | null }>({
    isOpen: false,
    customer: null
  });

  const fetchCustomers = async () => {
    try {
      const res = await adminApi.getUsers('CUSTOMER');
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && c.is_active !== false) ||
        (statusFilter === 'INACTIVE' && c.is_active === false);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleConfirmToggleActive = async () => {
    if (!confirmModal.customer) return;
    const user = confirmModal.customer;
    try {
      const res = await adminApi.toggleUserActive(user.id);
      if (res.success) {
        toast.success(res.message || 'Account status updated');
        await fetchCustomers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update account status.');
    } finally {
      setConfirmModal({ isOpen: false, customer: null });
    }
  };

  const exportCSV = () => {
    const headers = ['ID,Full Name,Email,Phone,Status,Joined Date'];
    const rows = filteredCustomers.map(
      c => `"${c.id}","${c.full_name}","${c.email}","${c.phone_number || 'N/A'}","${c.is_active !== false ? 'Active' : 'Inactive'}","${c.created_at || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `minidmart_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer report exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" /> Customer Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage customer profiles, account statuses, activity, and spending
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dmart-card p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or email..."
            className="dmart-input pl-10"
          />
        </div>


        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dmart-select w-36"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table Surface */}
      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredCustomers.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No customer records matching search criteria.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {customer.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{customer.full_name}</p>
                          <p className="text-xs text-slate-400 font-mono">ID: {customer.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}
                        </p>
                        {customer.phone_number && (
                          <p className="text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone_number}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {customer.is_active !== false ? (
                        <span className="badge-success">ACTIVE</span>
                      ) : (
                        <span className="badge-danger">DEACTIVATED</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-mono">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="btn-secondary py-1 px-3 text-xs"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, customer })}
                        className={customer.is_active !== false ? 'btn-outline-danger py-1 px-3 text-xs' : 'btn-primary py-1 px-3 text-xs'}
                      >
                        {customer.is_active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-lg">
                  {selectedCustomer.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.full_name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="btn-secondary py-1 px-2.5 text-xs">Close</button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-medium">Account Role</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedCustomer.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Account Status</span>
                  <span className={selectedCustomer.is_active !== false ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                    {selectedCustomer.is_active !== false ? 'Active' : 'Deactivated'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button onClick={() => setSelectedCustomer(null)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.customer?.is_active !== false ? 'Deactivate Customer Account' : 'Activate Customer Account'}
        message={`Are you sure you want to ${confirmModal.customer?.is_active !== false ? 'deactivate' : 'activate'} account for ${confirmModal.customer?.full_name}?`}
        confirmText={confirmModal.customer?.is_active !== false ? 'Deactivate Account' : 'Activate Account'}
        variant={confirmModal.customer?.is_active !== false ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setConfirmModal({ isOpen: false, customer: null })}
      />
    </div>
  );
};
