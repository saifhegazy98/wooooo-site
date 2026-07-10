// WOOOOO admin — service worker for Web Push notifications.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data.json(); } catch (e) { data = { title: 'WOOOOO', body: event.data && event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'WOOOOO · Review', {
      body: data.body || 'A moment needs your review.',
      icon: '/assets/apple-touch-icon.png',
      badge: '/assets/apple-touch-icon.png',
      tag: 'wooooo-review',
      data: { url: data.url || '/admin/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if (c.url.includes('/admin') && 'focus' in c) return c.focus(); }
      return self.clients.openWindow(url);
    }),
  );
});
