const CACHE_NAME = 'anthozoa-cache-v5'; // Bump this when you want to force a full recache
const urlsToCache = [
    './',
    './index.html',
    './anthozoa.css',
    './manifest.json',
    './Icons/AnthozoaTitle.png',
    './Icons/icon-192x192.png',
    './Icons/icon-512x512.png',
    './Icons/icon-maskable-512x512.png',
    './Icons/favicon-32x32.png',
    './Icons/favicon-16x16.png',
    './Icons/apple-touch-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(new Request(url, {cache: 'reload'})).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
            });
          })
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('anthozoa-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Take control immediately
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const acceptHeader = req.headers.get('accept') || '';

  // Network-first for HTML and CSS
  if (
    req.mode === 'navigate' ||
    (req.method === 'GET' && acceptHeader.includes('text/html')) ||
    (req.method === 'GET' && acceptHeader.includes('text/css'))
  ) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Update cache with latest file
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req)
      .then(response => response || fetch(req))
  );
});
