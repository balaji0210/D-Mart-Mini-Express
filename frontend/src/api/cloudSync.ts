import { apiClient } from './client';

const CLOUD_SYNC_CHANNEL = 'dmart_cloud_sync_channel_v5';

export const SYNC_KEYS = [
  'dmart_shared_orders_v5',
  'dmart_registered_users_v2',
  'dmart_shared_products_v2',
  'dmart_shared_categories_v2',
  'dmart_shared_returns_v2',
  'dmart_shared_pickup_slots_v4',
];

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CLOUD_SYNC_CHANNEL);
  }
} catch (e) {}

export const pushToCloudSync = async (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}

  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ key, data, timestamp: Date.now() });
    }
  } catch (e) {}

  try {
    await apiClient.post('/sync/', { key, value: data });
  } catch (e) {}
};

export const fetchRemoteSyncKey = async (key: string) => {
  try {
    const res = await apiClient.get('/sync/', { params: { key } });
    if (res.data && res.data.success && res.data.data !== null && res.data.data !== undefined) {
      let remoteData = res.data.data;
      if (typeof remoteData === 'string') {
        try {
          remoteData = JSON.parse(remoteData);
          if (typeof remoteData === 'string') {
            remoteData = JSON.parse(remoteData);
          }
        } catch (e) {}
      }

      const localRaw = localStorage.getItem(key);
      let localParsed = null;
      if (localRaw) {
        try {
          localParsed = JSON.parse(localRaw);
          if (typeof localParsed === 'string') {
            localParsed = JSON.parse(localParsed);
          }
        } catch (e) {}
      }

      const remoteStr = JSON.stringify(remoteData);
      const localStr = JSON.stringify(localParsed);

      if (remoteStr !== localStr) {
        localStorage.setItem(key, remoteStr);
        return remoteData;
      }
      return remoteData;
    }
  } catch (e) {}
  return null;
};

export const broadcastDataChange = (key: string, data: any) => {
  pushToCloudSync(key, data).catch(() => {});
};

export const subscribeToDataChanges = (callback: (key: string, data: any) => void) => {
  try {
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.key) {
          callback(event.data.key, event.data.data);
        }
      };
    }
  } catch (e) {}
};

let syncIntervalStarted = false;

export const startPeriodicCloudSync = (onUpdate?: (key: string, data: any) => void) => {
  if (syncIntervalStarted) return;
  syncIntervalStarted = true;

  const poll = async () => {
    for (const key of SYNC_KEYS) {
      const updated = await fetchRemoteSyncKey(key);
      if (updated && onUpdate) {
        onUpdate(key, updated);
      }
    }
  };

  poll();
  setInterval(poll, 2500);
};
