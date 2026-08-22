import { apiClient } from './client';

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
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return {
          success: true,
          data: {
            logs: MOCK_AUDIT_LOGS,
            total: MOCK_AUDIT_LOGS.length,
            page: 1,
            pages: 1,
          },
        };
      }
      throw err;
    }
  },

  getUsers: async (role?: string) => {
    try {
      const res = await apiClient.get('/auth/users/', { params: { role } });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        let filtered = [...MOCK_USERS];
        if (role) {
          filtered = filtered.filter(u => u.role === role);
        }
        return { success: true, data: filtered };
      }
      throw err;
    }
  },

  createStaff: async (data: { email: string; full_name: string; password: string; role?: string }) => {
    try {
      const res = await apiClient.post('/auth/users/staff/create/', data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const newUser = {
          id: `usr-${Date.now()}`,
          full_name: data.full_name,
          email: data.email,
          role: data.role || 'STAFF',
          is_active: true,
        };
        MOCK_USERS.push(newUser);
        return { success: true, message: `Staff member ${data.full_name} created successfully`, data: newUser };
      }
      throw err;
    }
  },

  toggleUserActive: async (id: string) => {
    try {
      const res = await apiClient.patch(`/auth/users/${id}/toggle-active/`);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
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
      }
      throw err;
    }
  },

  getOrders: async () => {
    try {
      const res = await apiClient.get('/orders/');
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return {
          success: true,
          data: {
            orders: [
              {
                id: 'ord-101',
                order_number: 'ORD-2026-000101',
                customer_name: 'John Customer',
                customer_email: 'customer@dmart.com',
                status: 'READY_FOR_PICKUP',
                fulfillment_type: 'PICKUP',
                total_amount: '18.45',
                created_at: new Date().toISOString(),
                items: [{ product_name: 'Fresh Organic Apples (1kg)', quantity: 2, unit_price: '3.99' }],
              },
            ],
          },
        };
      }
      throw err;
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const res = await apiClient.patch(`/orders/${id}/status/`, { status });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: `Order status updated to ${status}` };
      }
      throw err;
    }
  },

  cancelOrder: async (id: string, reason?: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/cancel/`, { reason });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: 'Order cancelled' };
      }
      throw err;
    }
  },

  processRefund: async (id: string, amount: number, reason?: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/refund/`, { amount, reason });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: `Refund of $${amount} processed successfully` };
      }
      throw err;
    }
  },
};
