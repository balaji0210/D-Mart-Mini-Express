import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cart';
import { useAuth } from './AuthContext';

interface CartItemData {
  id: string;
  product: any;
  quantity: number;
  subtotal: number | string;
}

interface CartContextType {
  cart: {
    items: CartItemData[];
    subtotal: number | string;
    total_items: number;
  } | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?.role]);

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    try {
      const res = await cartApi.addItem(productId, quantity);
      if (res.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const res = await cartApi.updateQuantity(itemId, quantity);
      if (res.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  };

  const removeItem = async (itemId: string): Promise<boolean> => {
    try {
      const res = await cartApi.removeItem(itemId);
      await fetchCart();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
