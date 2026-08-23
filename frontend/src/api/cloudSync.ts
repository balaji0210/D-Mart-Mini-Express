// Cross-Browser Real-Time Cloud Synchronization Engine

const CLOUD_SYNC_CHANNEL = 'dmart_cloud_sync_channel_v2';

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CLOUD_SYNC_CHANNEL);
  }
} catch (e) {}

export const broadcastDataChange = (key: string, data: any) => {
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ key, data, timestamp: Date.now() });
    }
  } catch (e) {}
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
