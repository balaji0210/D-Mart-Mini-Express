import { apiClient } from './client';

export const adminApi = {
  getAuditLogs: async (page: number = 1) => {
    const res = await apiClient.get('/admin/audit-logs/', { params: { page } });
    return res.data;
  },
  getUsers: async (role?: string) => {
    const res = await apiClient.get('/auth/users/', { params: { role } });
    return res.data;
  },
  createStaff: async (data: { email: string; full_name: string; password: string; role?: string }) => {
    const res = await apiClient.post('/auth/users/staff/create/', data);
    return res.data;
  },
  toggleUserActive: async (id: string) => {
    const res = await apiClient.patch(`/auth/users/${id}/toggle-active/`);
    return res.data;
  },
  getOrders: async () => {
    const res = await apiClient.get('/orders/');
    return res.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/orders/${id}/status/`, { status });
    return res.data;
  },
  cancelOrder: async (id: string, reason?: string) => {
    const res = await apiClient.post(`/orders/${id}/cancel/`, { reason });
    return res.data;
  },
  processRefund: async (id: string, amount: number, reason?: string) => {
    const res = await apiClient.post(`/orders/${id}/refund/`, { amount, reason });
    return res.data;
  },
};

