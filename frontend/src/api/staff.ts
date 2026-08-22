import { apiClient } from './client';

export const staffApi = {
  getAssignedOrders: async () => {
    const res = await apiClient.get('/orders/');
    return res.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/orders/${id}/status/`, { status });
    return res.data;
  },
  flagOrderIssue: async (id: string, issue: string) => {
    const res = await apiClient.post(`/orders/${id}/flag-issue/`, { issue });
    return res.data;
  },
};
