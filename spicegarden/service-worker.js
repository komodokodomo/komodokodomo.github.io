'use strict';

const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
  './offline.html',
  './favicon.ico',
  './img/splash.png',
  './img/ui/faces1.png',
  './img/ui/faces2.png',
  './img/ui/faces3.png',
  './img/ui/faces4.png',
  './img/ui/faces5.png',
  './img/ui/faces6.png',
  './img/ui/faces7.png',
  './img/ui/faces8.png',
  './img/ui/left.png',
  './img/ui/right.png',
  './fonts/noto-sans-700.woff2',
  './fonts/noto-sans-italic.woff2',
  './fonts/noto-sans-regular.woff2',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);

  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
      return response || fetch(evt.request);
    })
  );
});