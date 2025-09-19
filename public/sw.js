// public/sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    self.clients.claim();
  });
  
  self.addEventListener('fetch', () => {
    // Minimal SW to enable installability; add Workbox for real offline caching later.
  });