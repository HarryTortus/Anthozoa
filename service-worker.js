// A simple service worker for caching the app's assets

const CACHE_NAME = 'anthozoa-cache-v1';
// List of files that make up the app shell
const urlsToCache = [
    '/',
    '/index.html',
    '/anthozoa.css',
    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap'
];

// Install event: open a cache and add the app shell files to it
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
