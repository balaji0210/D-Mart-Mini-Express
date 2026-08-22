import { apiClient } from './client';
import { ProductFilterParams } from '../types/product';

export const productsApi = {
  getCategories: async () => {
    const res = await apiClient.get('/categories/');
    return res.data;
  },
  createCategory: async (data: { name: string; description?: string }) => {
    const res = await apiClient.post('/categories/', data);
    return res.data;
  },
  updateCategory: async (id: string, data: { name: string; description?: string }) => {
    const res = await apiClient.put(`/categories/${id}/`, data);
    return res.data;
  },

  getProducts: async (params?: ProductFilterParams) => {
    const res = await apiClient.get('/products/', { params });
    return res.data;
  },
  getProductDetail: async (id: string) => {
    const res = await apiClient.get(`/products/${id}/`);
    return res.data;
  },
  createProduct: async (data: any) => {
    const res = await apiClient.post('/products/', data);
    return res.data;
  },
  updateProduct: async (id: string, data: any) => {
    const res = await apiClient.put(`/products/${id}/`, data);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await apiClient.delete(`/products/${id}/`);
    return res.data;
  },
};
