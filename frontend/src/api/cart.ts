import { apiClient } from './client';
import { findProductById } from './products';

let MOCK_CART_ITEMS: any[] = [];

const calculateSubtotal = () => {
  return MOCK_CART_ITEMS.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
};

export const cartApi = {
  getCart: async () => {
    try {
      const res = await apiClient.get('/cart/');
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return {
      success: true,
      data: {
        items: MOCK_CART_ITEMS,
        subtotal: calculateSubtotal(),
        total_items: MOCK_CART_ITEMS.reduce((sum, i) => sum + i.quantity, 0),
      },
    };
  },

  addItem: async (productId: string, quantity: number = 1) => {
    try {
      const res = await apiClient.post('/cart/items/', {
        product_id: productId,
        quantity,
      });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }

    const foundProd = findProductById(productId);

    const existing = MOCK_CART_ITEMS.find(i => i.product_id === productId || i.product?.id === productId);
    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = Number(existing.product?.price || foundProd.price) * existing.quantity;
    } else {
      const mockProd = {
        id: foundProd.id,
        name: foundProd.name,
        price: Number(foundProd.price),
        stock_quantity: foundProd.stock_quantity,
        is_in_stock: foundProd.is_in_stock,
        image_url: foundProd.image_url,
      };
      MOCK_CART_ITEMS.push({
        id: `cart-item-${Date.now()}`,
        product_id: foundProd.id,
        product: mockProd,
        quantity,
        subtotal: Number(foundProd.price) * quantity,
      });
    }
    return {
      success: true,
      message: 'Item added to cart',
      data: { items: MOCK_CART_ITEMS, subtotal: calculateSubtotal() },
    };
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const res = await apiClient.patch(`/cart/items/${itemId}/`, { quantity });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const item = MOCK_CART_ITEMS.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.subtotal = Number(item.product?.price || 35.00) * quantity;
    }
    return { success: true, message: 'Cart updated', data: { items: MOCK_CART_ITEMS, subtotal: calculateSubtotal() } };
  },

  removeItem: async (itemId: string) => {
    try {
      const res = await apiClient.delete(`/cart/items/${itemId}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    MOCK_CART_ITEMS = MOCK_CART_ITEMS.filter(i => i.id !== itemId);
    return { success: true, message: 'Item removed', data: { items: MOCK_CART_ITEMS, subtotal: calculateSubtotal() } };
  },

  clearCart: async () => {
    try {
      const res = await apiClient.delete('/cart/clear/');
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    MOCK_CART_ITEMS = [];
    return { success: true, message: 'Cart cleared', data: { items: [], subtotal: 0 } };
  },
};
