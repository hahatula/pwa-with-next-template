import { App, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { credential as _credential, ServiceAccount } from 'firebase-admin';

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: _credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as ServiceAccount),
  });
} else {
  adminApp = getApps()[0]!;
}

export const adminMessaging = getMessaging(adminApp);