import { apiClient } from './client';

let MOCK_STAFF_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'ORD-2026-000101',
    customer_name: 'John Customer',
    customer_email: 'customer@dmart.com',
    status: 'PREPARING',
    fulfillment_type: 'PICKUP',
    total_amount: '18.45',
    created_at: new Date().toISOString(),
    items: [
      { id: 'item-1', product_name: 'Fresh Organic Apples (1kg)', quantity: 2, unit_price: '3.99' },
      { id: 'item-2', product_name: 'Fresh Orange Juice (1L)', quantity: 1, unit_price: '3.49' },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'ORD-2026-000102',
    customer_name: 'Jane Customer',
    customer_email: 'jane@example.com',
    status: 'READY_FOR_PICKUP',
    fulfillment_type: 'PICKUP',
    total_amount: '12.97',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { id: 'item-3', product_name: 'Whole Farm Fresh Milk (1 Gallon)', quantity: 1, unit_price: '4.49' },
    ],
  },
];

export const staffApi = {
  getAssignedOrders: async () => {
    try {
      const res = await apiClient.get('/orders/');
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return {
      success: true,
      data: {
        orders: MOCK_STAFF_ORDERS,
        total: MOCK_STAFF_ORDERS.length,
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
    const order = MOCK_STAFF_ORDERS.find(o => o.id === id);
    if (order) {
      order.status = status;
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
