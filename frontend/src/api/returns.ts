import { apiClient } from './client';

export const returnsApi = {
  createRequest: async (data: {
    order_item_id: string;
    request_type: 'RETURN' | 'EXCHANGE';
    reason: string;
    replacement_product_id?: string | null;
  }) => {
    const res = await apiClient.post('/returns/', data);
    return res.data;
  },
  getRequests: async () => {
    const res = await apiClient.get('/returns/');
    return res.data;
  },
  getRequestDetail: async (id: string) => {
    const res = await apiClient.get(`/returns/${id}/`);
    return res.data;
  },
  processRequest: async (id: string, status: string, replacementProductId?: string, rejectionReason?: string) => {
    const res = await apiClient.patch(`/returns/${id}/process/`, {
      status,
      replacement_product_id: replacementProductId,
      rejection_reason: rejectionReason,
    });
    return res.data;
  },
};
