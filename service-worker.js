// A simple service worker for caching the app's assets

const CACHE_NAME = 'anthozoa-cache-v2'; // Updated cache name
// List of files that make up the app shell, now including icons
const urlsToCache = [
    '/',
    '/index.html',
    '/anthozoa.css',
    '/Icons/AnthozoaTitle.png',
    '/Icons/icon-192x192.png',
    '/Icons/icon-512x512.png',
    '/Icons/icon-maskable-512x512.png',
    '/Icons/favicon-32x32.png',
    '/Icons/favicon-16x16.png',
    '/Icons/apple-touch-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap'
];

// Install event: open a cache and add the app shell files to it
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        // Use addAll with a catch for individual file failures
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
            });
          })
        );
      })
  );
});

// Activate event: clean up old caches
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
