import { apiClient } from './client';
import { User, AuthTokens } from '../types/auth';

export const authApi = {
  register: async (data: any) => {
    const res = await apiClient.post('/auth/register/', data);
    return res.data;
  },
  login: async (credentials: any) => {
    const res = await apiClient.post('/auth/login/', credentials);
    return res.data;
  },
  getProfile: async () => {
    const res = await apiClient.get('/auth/profile/');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await apiClient.put('/auth/profile/', data);
    return res.data;
  },
};
