const CACHE_NAME = 'ts-leather-v1';

const PRECACHE_URLS = [
  '/',
  '/assets/logo_new.jpg',
  '/assets/logo_1.png',
  '/assets/jacket.jpg',
  '/assets/jacket_main.jpg',
  '/assets/jacket_main_full.jpg',
  '/assets/wallet.png',
  '/assets/leather.jpg',
  '/assets/leather_full.jpg',
  '/assets/custom.jpg',
  '/assets/winter.jpg',
  '/assets/spring.jpg',
  '/assets/summer.jpg',
  '/assets/fall.jpg',
  '/assets/card_guest.jpg',
];

// precache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// cache for images & urls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    url.pathname.startsWith('/assets/') ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
