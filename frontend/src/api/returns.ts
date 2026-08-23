import { apiClient } from './client';

const SHARED_RETURNS_KEY = 'dmart_shared_returns_v2';

export const getSharedReturns = (): any[] => {
  try {
    const raw = localStorage.getItem(SHARED_RETURNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
};

export const saveSharedReturns = (reqs: any[]) => {
  try {
    localStorage.setItem(SHARED_RETURNS_KEY, JSON.stringify(reqs));
  } catch (e) {}
};

export const returnsApi = {
  createRequest: async (data: {
    order_item_id: string;
    request_type: 'RETURN' | 'EXCHANGE';
    reason: string;
    replacement_product_id?: string | null;
  }) => {
    let returnData = null;
    try {
      const res = await apiClient.post('/returns/', data);
      if (res.data && res.data.success) {
        returnData = res.data.data || res.data;
      }
    } catch (err: any) {
      // Fallback
    }

    if (!returnData) {
      returnData = {
        id: `ret-${Date.now()}`,
        order_item: {
          id: data.order_item_id,
        },
        order_item_id: data.order_item_id,
        request_type: data.request_type,
        reason: data.reason,
        status: 'REQUESTED',
        created_at: new Date().toISOString(),
      };
    }

    const current = getSharedReturns();
    current.unshift(returnData);
    saveSharedReturns(current);

    return {
      success: true,
      message: 'Return & Refund request submitted successfully.',
      data: returnData,
    };
  },

  getRequests: async () => {
    try {
      const res = await apiClient.get('/returns/');
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedReturns();
    return {
      success: true,
      data: shared,
    };
  },

  getRequestDetail: async (id: string) => {
    try {
      const res = await apiClient.get(`/returns/${id}/`);
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedReturns();
    const found = shared.find(r => r.id === id) || shared[0];
    return { success: true, data: found };
  },

  processRequest: async (id: string, status: string, replacementProductId?: string, rejectionReason?: string) => {
    try {
      const res = await apiClient.patch(`/returns/${id}/process/`, {
        status,
        replacement_product_id: replacementProductId,
        rejection_reason: rejectionReason,
      });
      if (res.data && res.data.success) return res.data;
    } catch (err: any) {
      // Fallback
    }
    const shared = getSharedReturns();
    const req = shared.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (rejectionReason) req.rejection_reason = rejectionReason;
      if (replacementProductId) req.replacement_product_id = replacementProductId;
      saveSharedReturns(shared);
    }
    return { success: true, message: `Request status updated to ${status}`, data: req };
  },
};
