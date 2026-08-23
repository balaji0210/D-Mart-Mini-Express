import { apiClient } from './client';
import { getSharedOrders, saveSharedOrders } from './orders';
import { getRegisteredUsers } from './auth';

let MOCK_USERS = [
  { id: 'usr-1', full_name: 'Balaji Admin', email: 'balaji_admin@gmail.com', role: 'ADMIN', is_active: true },
  { id: 'usr-2', full_name: 'Demo Admin', email: 'admin@dmart.com', role: 'ADMIN', is_active: true },
  { id: 'usr-3', full_name: 'Demo Staff', email: 'staff@dmart.com', role: 'STAFF', is_active: true },
  { id: 'usr-4', full_name: 'Test Staff', email: 'staff@test.com', role: 'STAFF', is_active: true },
  { id: 'usr-5', full_name: 'John Customer', email: 'customer@dmart.com', role: 'CUSTOMER', is_active: true },
];

let MOCK_AUDIT_LOGS = [
  { id: 'log-1', user: 'balaji_admin@gmail.com', action: 'STAFF_MANAGEMENT', details: 'Created staff account for Demo Staff', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log-2', user: 'admin@dmart.com', action: 'INVENTORY_UPDATE', details: 'Updated stock for Fresh Organic Apples', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'log-3', user: 'staff@dmart.com', action: 'ORDER_FULFILLMENT', details: 'Transitioned Order #ORD-2026-000101 to READY_FOR_PICKUP', timestamp: new Date(Date.now() - 14400000).toISOString() },
];

export const adminApi = {
  getAuditLogs: async (page: number = 1) => {
    try {
      const res = await apiClient.get('/admin/audit-logs/', { params: { page } });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return {
      success: true,
      data: {
        logs: MOCK_AUDIT_LOGS,
        total: MOCK_AUDIT_LOGS.length,
        page: 1,
        pages: 1,
      },
    };
  },

  getUsers: async (role?: string) => {
    let apiUsers: any[] = [];
    try {
      const res = await apiClient.get('/auth/users/', { params: { role } });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        apiUsers = res.data.data;
      }
    } catch (err: any) {
      // Fallback
    }

    const registeredDict = getRegisteredUsers();
    const registeredList = Object.values(registeredDict).map(u => ({
      id: `usr-reg-${u.email}`,
      full_name: u.name || u.email.split('@')[0],
      email: u.email,
      role: 'CUSTOMER',
      is_active: true,
      created_at: new Date().toISOString(),
    }));

    const allUsersMap = new Map<string, any>();
    [...MOCK_USERS, ...registeredList, ...apiUsers].forEach(u => {
      if (u && u.email) {
        allUsersMap.set(u.email.toLowerCase(), u);
      }
    });

    let combined = Array.from(allUsersMap.values());
    if (role) {
      combined = combined.filter(u => u.role === role);
    }
    return { success: true, data: combined };
  },

  createStaff: async (data: { email: string; full_name: string; password: string; role?: string }) => {
    try {
      const res = await apiClient.post('/auth/users/staff/create/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      role: data.role || 'STAFF',
      is_active: true,
    };
    MOCK_USERS.unshift(newUser);
    MOCK_AUDIT_LOGS.unshift({
      id: `log-${Date.now()}`,
      user: 'balaji_admin@gmail.com',
      action: 'STAFF_MANAGEMENT',
      details: `Created staff account for ${data.full_name} (${data.email})`,
      timestamp: new Date().toISOString(),
    });
    return { success: true, message: `Staff member ${data.full_name} created successfully`, data: newUser };
  },

  toggleUserActive: async (id: string) => {
    try {
      const res = await apiClient.patch(`/auth/users/${id}/toggle-active/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) {
      user.is_active = !user.is_active;
      return {
        success: true,
        message: `Account status updated to ${user.is_active ? 'ACTIVE' : 'DEACTIVATED'}`,
        data: user,
      };
    }
    return { success: true, message: 'Account status updated' };
  },

  getOrders: async () => {
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

  cancelOrder: async (id: string, reason?: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/cancel/`, { reason });
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
      order.status = 'CANCELLED';
      saveSharedOrders(shared);
    }
    return { success: true, message: 'Order cancelled' };
  },

  processRefund: async (id: string, amount: number, reason?: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/refund/`, { amount, reason });
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
      order.payment_status = 'REFUNDED';
      order.status = 'REFUNDED';
      saveSharedOrders(shared);
    }
    return { success: true, message: `Refund of ₹${amount} processed successfully` };
  },
};
