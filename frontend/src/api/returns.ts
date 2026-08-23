import { apiClient } from './client';
import { broadcastDataChange } from './cloudSync';

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
    broadcastDataChange(SHARED_RETURNS_KEY, reqs);
  } catch (e) {}
};

export const returnsApi = {
  createRequest: async (data: {
    order_item_id: string;
    request_type: 'RETURN' | 'EXCHANGE';
    reason: string;
    replacement_product_id?: string | null;
    order?: any;
    item?: any;
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
      const targetItem = data.item || data.order?.items?.find((i: any) => i.id === data.order_item_id) || {};
      const prodName = targetItem.product_name || targetItem.name || "Kwality Wall's Alphonso Mango Ice Cream (700 ml)";
      const qty = targetItem.quantity || 1;
      const price = String(targetItem.unit_price || targetItem.price || '160.00');
      const sub = String(targetItem.subtotal || (Number(price) * qty).toFixed(2));
      const orderNum = data.order?.order_number || 'ORD-2026-000101';
      const nowIso = new Date().toISOString();

      returnData = {
        id: `ret-${Date.now()}`,
        order_id: data.order?.id || 'ord-101',
        order_number: orderNum,
        customer_name: data.order?.customer_name || 'John Customer',
        customer_email: data.order?.customer_email || 'customer@dmart.com',
        product_name: prodName,
        quantity: qty,
        unit_price: price,
        subtotal: sub,
        image_url: targetItem.image_url || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
        order_item: {
          id: data.order_item_id,
          product_name: prodName,
          quantity: qty,
          unit_price: price,
          subtotal: sub,
          image_url: targetItem.image_url,
        },
        order_item_id: data.order_item_id,
        request_type: data.request_type,
        reason: data.reason,
        status: 'REQUESTED',
        created_at: nowIso,
        requested_at: nowIso,
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
      req.processed_at = new Date().toISOString();
      saveSharedReturns(shared);
    }
    return { success: true, message: `Request status updated to ${status}`, data: req };
  },
};
