// Service Worker for Cosmic Scale Visualization
const CACHE_VERSION = 'cosmic-scale-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/favicon.png',
  '/manifest.webmanifest',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Install event: cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('Opening cache:', CACHE_VERSION);
      return cache.addAll(CACHE_URLS).catch(error => {
        console.warn('Cache addAll failed, some resources might not be cached:', error);
        // Continue even if some resources fail to cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // Return cached response if available
        return response;
      }

      return fetch(event.request).then(response => {
        // Clone the response since it can only be consumed once
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(error => {
        console.warn('Fetch failed, serving from cache:', event.request.url, error);
        // Return a cached response if network fails
        return caches.match(event.request);
      });
    })
  );
});
