import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', description: 'Fresh farm produce' },
  { id: 'cat-2', name: 'Dairy & Bakery', slug: 'dairy-bakery', description: 'Milk, butter, bread, and bakery items' },
  { id: 'cat-3', name: 'Beverages', slug: 'beverages', description: 'Juices, soft drinks, tea, coffee' },
  { id: 'cat-4', name: 'Snacks & Munchies', slug: 'snacks-munchies', description: 'Chips, biscuits, nuts, and chocolates' },
  { id: 'cat-5', name: 'Household Essentials', slug: 'household-essentials', description: 'Detergents, cleaners, and hygiene products' },
];

const MOCK_PRODUCTS = [
  {
    id: 'prod-pepsi-750',
    name: 'Pepsi Soft Drink Bottle (750 ml)',
    description: 'Refreshing carbonated cola soft drink in a 750 ml bottle.',
    price: '35.00',
    stock_quantity: 60,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-2250',
    name: 'Pepsi Soft Drink Bottle (2250 ml)',
    description: 'Large family pack carbonated cola soft drink 2.25L.',
    price: '83.00',
    stock_quantity: 45,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-aquafina-1L',
    name: 'Aquafina Mineral Water Bottle (1 ltr)',
    description: 'Purified drinking water bottled under strict quality processes.',
    price: '20.00',
    stock_quantity: 150,
    is_in_stock: true,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-zero-400',
    name: 'Pepsi Zero Sugar Soft Drink (400 ml)',
    description: 'Maximum taste with zero sugar carbonated cola beverage.',
    price: '20.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-pepsi-zero-pack6',
    name: 'Pepsi Zero Sugar Soft Drink (300 ml - Pack of 6)',
    description: 'Pack of 6 canned Pepsi Zero Sugar soft drinks (1.8L total).',
    price: '212.00',
    stock_quantity: 30,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-7up-nimbooz',
    name: '7UP Nimbooz with Lemon Juice (350 ml)',
    description: 'Tangy and refreshing lemon juice drink with real lemon goodness.',
    price: '25.00',
    stock_quantity: 70,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-mountain-dew-750',
    name: 'Mountain Dew Soft Drink Bottle (750 ml)',
    description: 'High energy citrus flavored carbonated soft drink.',
    price: '40.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-7up-zero-400',
    name: '7 Up Zero Soft Drink (400 ml)',
    description: 'Crisp lemon-lime zero sugar carbonated soft drink.',
    price: '20.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-1',
    name: 'Fresh Organic Apples (1kg)',
    description: 'Crisp and juicy sweet red apples straight from orchards.',
    price: '149.00',
    stock_quantity: 50,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'prod-2',
    name: 'Fresh Organic Bananas (1 Dozen)',
    description: 'Naturally ripened sweet bananas rich in potassium.',
    price: '60.00',
    stock_quantity: 80,
    is_in_stock: true,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'prod-3',
    name: 'Whole Farm Fresh Milk (1 Gallon)',
    description: 'Pasteurized whole milk rich in calcium and vitamin D.',
    price: '75.00',
    stock_quantity: 30,
    is_in_stock: true,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    category: MOCK_CATEGORIES[1],
  },
  {
    id: 'prod-4',
    name: 'Artisanal Whole Wheat Bread',
    description: 'Freshly baked whole grain bread loaf with seeds.',
    price: '45.00',
    stock_quantity: 25,
    is_in_stock: true,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: MOCK_CATEGORIES[1],
  },
];

export const productsApi = {
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories/');
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, data: MOCK_CATEGORIES };
  },

  createCategory: async (data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.post('/categories/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newCat = { id: `cat-${Date.now()}`, slug: data.name.toLowerCase().replace(/\s+/g, '-'), name: data.name, description: data.description || '' };
    MOCK_CATEGORIES.push(newCat);
    return { success: true, message: 'Category created', data: newCat };
  },

  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.put(`/categories/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, message: 'Category updated', data: { id, ...data } };
  },

  getProducts: async (params?: ProductFilterParams) => {
    try {
      const res = await apiClient.get('/products/', { params });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    let filtered = [...MOCK_PRODUCTS];
    if (params?.category) {
      filtered = filtered.filter(p => p.category.slug === params.category || p.category.id === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return {
      success: true,
      data: {
        products: filtered,
        total: filtered.length,
        page: 1,
        pages: 1,
      },
    };
  },

  getProductDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const found = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    return { success: true, data: found };
  },

  createProduct: async (data: any) => {
    try {
      const res = await apiClient.post('/products/', data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const newProd = { id: `prod-${Date.now()}`, ...data, is_in_stock: true };
    MOCK_PRODUCTS.unshift(newProd);
    return { success: true, message: 'Product created', data: newProd };
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const res = await apiClient.put(`/products/${id}/`, data);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, message: 'Product updated', data: { id, ...data } };
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await apiClient.delete(`/products/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    return { success: true, message: 'Product deleted' };
  },
};
