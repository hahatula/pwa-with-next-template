import { getBrowserMessaging } from './client';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';

export async function ensureFCMToken(): Promise<string | null> {
  const messaging = await getBrowserMessaging();
  if (!messaging) return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;
  return getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY });
}

export async function listenForeground(handler: (payload: MessagePayload) => void) {
  const messaging = await getBrowserMessaging();
  if (!messaging) return () => {};
  return onMessage(messaging, handler);
}