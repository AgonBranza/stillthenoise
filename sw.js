const CACHE = 'stillthenoise-v1';
const PAGES = [
  '/',
  '/index.html',
  '/didnt-say-so.html',
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
