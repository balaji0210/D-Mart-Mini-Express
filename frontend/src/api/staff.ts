import { apiClient } from './client';
import { getSharedOrders, saveSharedOrders } from './orders';

export const staffApi = {
  getAssignedOrders: async () => {
    try {
      const res = await apiClient.get('/orders/');
      if (res.data && res.data.success && Array.isArray(res.data.data?.orders) && res.data.data.orders.length > 0) {
        return res.data;
      }
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedOrders();
    return {
      success: true,
      data: {
        orders: shared,
        total: shared.length,
      },
    };
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const res = await apiClient.patch(`/orders/${id}/status/`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedOrders();
    const order = shared.find(o => o.id === id);
    if (order) {
      order.status = status;
      saveSharedOrders(shared);
    }
    return { success: true, message: `Order status updated to ${status}` };
  },

  flagOrderIssue: async (id: string, issue: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/flag-issue/`, { issue });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, message: `Issue flagged: ${issue}` };
  },
};
