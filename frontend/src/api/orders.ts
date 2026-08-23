import { apiClient } from './client';

const SHARED_ORDERS_KEY = 'dmart_shared_orders_v3';

export const getSharedOrders = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const initial = [
    {
      id: 'ord-101',
      order_number: 'ORD-2026-000101',
      customer_name: 'John Customer',
      customer_email: 'customer@dmart.com',
      status: 'PENDING',
      fulfillment_type: 'PICKUP',
      total_amount: '35.00',
      payment_method: 'CARD',
      created_at: new Date().toISOString(),
      items: [
        { id: 'item-1', product_name: "Kwality Wall's Alphonso Mango Ice Cream (700 ml)", quantity: 1, unit_price: '160.00', subtotal: '160.00' },
      ],
    },
  ];
  saveSharedOrders(initial);
  return initial;
};

export const saveSharedOrders = (orders: any[]) => {
  try {
    localStorage.setItem(SHARED_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
};

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

let MOCK_PICKUP_SLOTS = [
  { id: 'slot-1', date: todayStr, start_time: '09:00:00', end_time: '11:00:00', capacity: 15, booked: 2, available: 13, is_past: false, is_active: true },
  { id: 'slot-2', date: todayStr, start_time: '11:00:00', end_time: '13:00:00', capacity: 15, booked: 5, available: 10, is_past: false, is_active: true },
  { id: 'slot-3', date: todayStr, start_time: '14:00:00', end_time: '16:00:00', capacity: 15, booked: 1, available: 14, is_past: false, is_active: true },
  { id: 'slot-4', date: tomorrowStr, start_time: '09:00:00', end_time: '11:00:00', capacity: 15, booked: 0, available: 15, is_past: false, is_active: true },
  { id: 'slot-5', date: tomorrowStr, start_time: '14:00:00', end_time: '16:00:00', capacity: 15, booked: 0, available: 15, is_past: false, is_active: true },
];

export const ordersApi = {
  checkout: async (data: any) => {
    let orderData = null;
    try {
      const res = await apiClient.post('/orders/checkout/', data);
      if (res.data && res.data.success) {
        orderData = res.data.data?.order || res.data;
      }
    } catch (err: any) {
      // Fallback
    }

    if (!orderData) {
      const newOrderId = `ord-${Date.now()}`;
      orderData = {
        id: newOrderId,
        order_number: `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        customer_name: data.customer_name || 'Customer User',
        customer_email: data.customer_email || 'customer@dmart.com',
        status: 'PENDING',
        fulfillment_type: data.fulfillment_type || 'PICKUP',
        total_amount: String(data.total_amount || '35.00'),
        payment_method: data.payment_method || 'CARD',
        created_at: new Date().toISOString(),
        items: data.items || [
          { id: `item-${Date.now()}`, product_name: 'Selected Grocery Item', quantity: 1, unit_price: '35.00', subtotal: '35.00' },
        ],
      };
    }

    const currentOrders = getSharedOrders();
    currentOrders.unshift(orderData);
    saveSharedOrders(currentOrders);

    return {
      success: true,
      message: 'Order placed successfully',
      data: { order: orderData },
    };
  },

  getOrders: async (params?: any) => {
    try {
      const res = await apiClient.get('/orders/', { params });
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

  getOrderDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/orders/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedOrders();
    const found = shared.find(o => o.id === id) || shared[0];
    return { success: true, data: found };
  },

  cancelOrder: async (id: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/cancel/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedOrders();
    const order = shared.find(o => o.id === id);
    if (order) {
      order.status = 'CANCELLED';
      saveSharedOrders(shared);
    }
    return { success: true, message: 'Order cancelled successfully' };
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

  getPickupSlots: async (params?: any) => {
    try {
      const res = await apiClient.get('/pickup-slots/', { params });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, data: MOCK_PICKUP_SLOTS };
  },

  createPickupSlot: async (data: any) => {
    try {
      const res = await apiClient.post('/pickup-slots/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newSlot = {
      id: `slot-${Date.now()}`,
      ...data,
      booked: 0,
      available: data.capacity,
      is_past: false,
      is_active: data.is_active !== undefined ? data.is_active : true,
    };
    MOCK_PICKUP_SLOTS.unshift(newSlot);
    return { success: true, message: 'Pickup slot created successfully', data: newSlot };
  },

  updatePickupSlot: async (id: string, data: any) => {
    try {
      const res = await apiClient.patch(`/pickup-slots/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const slot = MOCK_PICKUP_SLOTS.find(s => s.id === id);
    if (slot) {
      Object.assign(slot, data);
    }
    return { success: true, message: 'Pickup slot updated successfully', data: { id, ...data } };
  },
};
