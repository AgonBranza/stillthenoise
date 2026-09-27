const CACHE = 'stillthenoise-v2';
const PAGES = [
  '/',
  '/index.html',
  '/didnt-say-so.html',
  '/goodbye-july.html',
  '/gone.html',
  '/holdingroom.html',
  '/magnetic.html',
  '/quiz.html',
  '/residue.html',
  '/shop.html',
  '/silent-rooms.html',
  '/triptych.html',
  '/unsent.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// network-first: always try to fetch the live version so updates show up
// immediately, and only fall back to the cache when the network request
// actually fails (genuinely offline) — the previous cache-first strategy
// meant a page, once cached, would never update again for that visitor
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return; // don't try to cache non-GET requests

  e.respondWith(
    fetch(e.request)
      .then(networkResponse => {
        const copy = networkResponse.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});
