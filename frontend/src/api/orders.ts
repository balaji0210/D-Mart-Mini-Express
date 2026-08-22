import { apiClient } from './client';

export const ordersApi = {
  checkout: async (data: {
    fulfillment_type: 'PICKUP' | 'DELIVERY';
    pickup_slot_id?: string | null;
    delivery_address?: any;
  }) => {
    const res = await apiClient.post('/orders/checkout/', data);
    return res.data;
  },
  getOrders: async (params?: { status?: string; fulfillment_type?: string; page?: number; page_size?: number }) => {
    const res = await apiClient.get('/orders/', { params });
    return res.data;
  },
  getOrderDetail: async (id: string) => {
    const res = await apiClient.get(`/orders/${id}/`);
    return res.data;
  },
  cancelOrder: async (id: string) => {
    const res = await apiClient.post(`/orders/${id}/cancel/`);
    return res.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/orders/${id}/status/`, { status });
    return res.data;
  },
  getPickupSlots: async (params?: { date?: string; include_past?: boolean }) => {
    const res = await apiClient.get('/pickup-slots/', { params });
    return res.data;
  },
  createPickupSlot: async (data: { date: string; start_time: string; end_time: string; capacity: number; is_active?: boolean }) => {
    const res = await apiClient.post('/pickup-slots/', data);
    return res.data;
  },
  updatePickupSlot: async (id: string, data: Partial<{ date: string; start_time: string; end_time: string; capacity: number; is_active: boolean }>) => {
    const res = await apiClient.patch(`/pickup-slots/${id}/`, data);
    return res.data;
  },
};
