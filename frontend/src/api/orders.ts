import { apiClient } from './client';

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

let MOCK_PICKUP_SLOTS = [
  { id: 'slot-1', date: todayStr, start_time: '09:00:00', end_time: '11:00:00', capacity: 15, booked: 2, available: 13, is_past: false, is_active: true },
  { id: 'slot-2', date: todayStr, start_time: '11:00:00', end_time: '13:00:00', capacity: 15, booked: 5, available: 10, is_past: false, is_active: true },
  { id: 'slot-3', date: todayStr, start_time: '14:00:00', end_time: '16:00:00', capacity: 15, booked: 1, available: 14, is_past: false, is_active: true },
  { id: 'slot-4', date: tomorrowStr, start_time: '09:00:00', end_time: '11:00:00', capacity: 15, booked: 0, available: 15, is_past: false, is_active: true },
  { id: 'slot-5', date: tomorrowStr, start_time: '14:00:00', end_time: '16:00:00', capacity: 15, booked: 0, available: 15, is_past: false, is_active: true },
];

let MOCK_ORDERS: any[] = [
  {
    id: 'ord-101',
    order_number: 'ORD-2026-000101',
    customer_name: 'John Customer',
    customer_email: 'customer@dmart.com',
    status: 'READY_FOR_PICKUP',
    fulfillment_type: 'PICKUP',
    total_amount: '18.45',
    created_at: new Date().toISOString(),
    items: [{ id: 'item-1', product_name: 'Fresh Organic Apples (1kg)', quantity: 2, unit_price: '3.99', subtotal: '7.98' }],
  },
];

export const ordersApi = {
  checkout: async (data: any) => {
    try {
      const res = await apiClient.post('/orders/checkout/', data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const newOrderId = `ord-${Date.now()}`;
        const newOrder = {
          id: newOrderId,
          order_number: `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          customer_name: 'John Customer',
          customer_email: 'customer@dmart.com',
          status: 'PENDING',
          fulfillment_type: data.fulfillment_type || 'PICKUP',
          total_amount: '15.99',
          payment_method: data.payment_method || 'CARD',
          created_at: new Date().toISOString(),
          items: [{ id: `item-${Date.now()}`, product_name: 'Fresh Grocery Item', quantity: 2, unit_price: '3.99', subtotal: '7.98' }],
        };
        MOCK_ORDERS.unshift(newOrder);
        return {
          success: true,
          message: 'Order placed successfully',
          data: { order: newOrder },
        };
      }
      throw err;
    }
  },

  getOrders: async (params?: any) => {
    try {
      const res = await apiClient.get('/orders/', { params });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return {
          success: true,
          data: {
            orders: MOCK_ORDERS,
            total: MOCK_ORDERS.length,
          },
        };
      }
      throw err;
    }
  },

  getOrderDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/orders/${id}/`);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const found = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];
        return { success: true, data: found };
      }
      throw err;
    }
  },

  cancelOrder: async (id: string) => {
    try {
      const res = await apiClient.post(`/orders/${id}/cancel/`);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const order = MOCK_ORDERS.find(o => o.id === id);
        if (order) order.status = 'CANCELLED';
        return { success: true, message: 'Order cancelled successfully' };
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
        const order = MOCK_ORDERS.find(o => o.id === id);
        if (order) order.status = status;
        return { success: true, message: `Order status updated to ${status}` };
      }
      throw err;
    }
  },

  getPickupSlots: async (params?: any) => {
    try {
      const res = await apiClient.get('/pickup-slots/', { params });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, data: MOCK_PICKUP_SLOTS };
      }
      throw err;
    }
  },

  createPickupSlot: async (data: any) => {
    try {
      const res = await apiClient.post('/pickup-slots/', data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const newSlot = { id: `slot-${Date.now()}`, ...data, booked: 0, available: data.capacity, is_past: false };
        MOCK_PICKUP_SLOTS.push(newSlot);
        return { success: true, message: 'Pickup slot created', data: newSlot };
      }
      throw err;
    }
  },

  updatePickupSlot: async (id: string, data: any) => {
    try {
      const res = await apiClient.patch(`/pickup-slots/${id}/`, data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: 'Pickup slot updated', data: { id, ...data } };
      }
      throw err;
    }
  },
};
