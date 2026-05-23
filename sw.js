// AVS Service Worker v1.0
const CACHE_NAME = 'avs-cache-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Escuchar notificaciones push
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || '🚗 AVS — Viaje Seguro';
  const options = {
    body: data.body || 'Tenés una nueva solicitud de viaje',
    icon: data.icon || '/avs-app/icon-192.png',
    badge: '/avs-app/icon-192.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'ver', title: '👀 Ver solicitud' },
      { action: 'ignorar', title: 'Ignorar' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Click en notificación
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'ver' || !e.action) {
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('avs-app') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('https://rigoalva-avs.github.io/avs-app/');
        }
      })
    );
  }
});
