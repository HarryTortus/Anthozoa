const CACHE_NAME = 'anthozoa-cache-v4'; // Updated cache name for new version
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
        console.log('Opened cache and caching assets');
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(new Request(url, {cache: 'no-store'})).catch(err => {
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
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
