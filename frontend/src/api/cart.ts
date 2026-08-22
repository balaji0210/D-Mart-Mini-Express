import { apiClient } from './client';

export const cartApi = {
  getCart: async () => {
    const res = await apiClient.get('/cart/');
    return res.data;
  },
  addItem: async (productId: string, quantity: number = 1) => {
    const res = await apiClient.post('/cart/items/', {
      product_id: productId,
      quantity,
    });
    return res.data;
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    const res = await apiClient.patch(`/cart/items/${itemId}/`, { quantity });
    return res.data;
  },
  removeItem: async (itemId: string) => {
    const res = await apiClient.delete(`/cart/items/${itemId}/`);
    return res.data;
  },
  clearCart: async () => {
    const res = await apiClient.delete('/cart/clear/');
    return res.data;
  },
};
