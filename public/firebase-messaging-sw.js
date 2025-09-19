/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY_VALUE',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_VALUE',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID_VALUE',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_VALUE',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID_VALUE'
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Background notification';
  const options = { body: payload.notification?.body ?? '', icon: '/icons/icon-192.png' };
  self.registration.showNotification(title, options);
});