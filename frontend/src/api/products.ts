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
    id: 'prod-1',
    name: 'Fresh Organic Apples (1kg)',
    description: 'Crisp and juicy sweet red apples straight from orchards.',
    price: '3.99',
    stock_quantity: 50,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'prod-2',
    name: 'Fresh Organic Bananas (1 Dozen)',
    description: 'Naturally ripened sweet bananas rich in potassium.',
    price: '1.99',
    stock_quantity: 80,
    low_stock_threshold: 15,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'prod-3',
    name: 'Whole Farm Fresh Milk (1 Gallon)',
    description: 'Pasteurized whole milk rich in calcium and vitamin D.',
    price: '4.49',
    stock_quantity: 30,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    category: MOCK_CATEGORIES[1],
  },
  {
    id: 'prod-4',
    name: 'Artisanal Whole Wheat Bread',
    description: 'Freshly baked whole grain bread loaf with seeds.',
    price: '2.99',
    stock_quantity: 4,
    low_stock_threshold: 10,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: MOCK_CATEGORIES[1],
  },
  {
    id: 'prod-5',
    name: 'Fresh Orange Juice (1L)',
    description: '100% pure squeezed orange juice with pulp.',
    price: '3.49',
    stock_quantity: 40,
    low_stock_threshold: 8,
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    category: MOCK_CATEGORIES[2],
  },
  {
    id: 'prod-6',
    name: 'Crispy Potato Chips (Family Pack)',
    description: 'Classic salted potato chips for quick snacking.',
    price: '2.49',
    stock_quantity: 100,
    low_stock_threshold: 20,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'prod-7',
    name: 'Eco-Friendly Dishwashing Liquid (500ml)',
    description: 'Tough on grease, soft on hands eco-friendly dish cleaner.',
    price: '3.99',
    stock_quantity: 25,
    low_stock_threshold: 5,
    image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17',
    category: MOCK_CATEGORIES[4],
  },
];

export const productsApi = {
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories/');
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, data: MOCK_CATEGORIES };
      }
      throw err;
    }
  },
  createCategory: async (data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.post('/categories/', data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const newCat = { id: `cat-${Date.now()}`, slug: data.name.toLowerCase().replace(/\s+/g, '-'), name: data.name, description: data.description || '' };
        MOCK_CATEGORIES.push(newCat);
        return { success: true, message: 'Category created', data: newCat };
      }
      throw err;
    }
  },
  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    try {
      const res = await apiClient.put(`/categories/${id}/`, data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: 'Category updated', data: { id, ...data } };
      }
      throw err;
    }
  },

  getProducts: async (params?: ProductFilterParams) => {
    try {
      const res = await apiClient.get('/products/', { params });
      return res.data;
    } catch (err: any) {
      if (!err.response) {
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
      }
      throw err;
    }
  },
  getProductDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/products/${id}/`);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const found = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
        return { success: true, data: found };
      }
      throw err;
    }
  },
  createProduct: async (data: any) => {
    try {
      const res = await apiClient.post('/products/', data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        const newProd = { id: `prod-${Date.now()}`, ...data };
        MOCK_PRODUCTS.push(newProd);
        return { success: true, message: 'Product created', data: newProd };
      }
      throw err;
    }
  },
  updateProduct: async (id: string, data: any) => {
    try {
      const res = await apiClient.put(`/products/${id}/`, data);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: 'Product updated', data: { id, ...data } };
      }
      throw err;
    }
  },
  deleteProduct: async (id: string) => {
    try {
      const res = await apiClient.delete(`/products/${id}/`);
      return res.data;
    } catch (err: any) {
      if (!err.response) {
        return { success: true, message: 'Product deleted' };
      }
      throw err;
    }
  },
};
