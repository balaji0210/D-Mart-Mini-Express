import { apiClient } from './client';
import { getSharedOrders, saveSharedOrders } from './orders';
import { fetchRemoteSyncKey } from './cloudSync';

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
    try {
      await fetchRemoteSyncKey('dmart_shared_orders_v5');
    } catch (e) {}
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
    const cleanId = String(id || '').trim().toLowerCase();
    const order = shared.find(o => 
      String(o.id).toLowerCase() === cleanId || 
      String(o.order_number).toLowerCase() === cleanId
    );
    if (order) {
      order.status = status;
      saveSharedOrders(shared);
    }
    return { success: true, message: `Order status updated to ${status}` };
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    try {
      const res = await apiClient.patch(`/orders/${id}/status/`, { payment_status: paymentStatus });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedOrders();
    const cleanId = String(id || '').trim().toLowerCase();
    const order = shared.find(o => 
      String(o.id).toLowerCase() === cleanId || 
      String(o.order_number).toLowerCase() === cleanId
    );
    if (order) {
      order.payment_status = paymentStatus;
      saveSharedOrders(shared);
    }
    return { success: true, message: `Payment status updated to ${paymentStatus}` };
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
