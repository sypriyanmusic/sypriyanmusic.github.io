const CACHE_NAME = 'sypriyan-v3';
const APP_SHELL = [
  "./",
  "./images/album-cover.png",
  "./images/amazon.png",
  "./images/apple.png",
"./images/dharman-sky-is-ours.png",
"./images/favicon.png",
  "./googlee11d77b56efe7208.html",
 "./images/hero-desktop.png",
"./images/hero-mobile.png",
"./images/hero.png",
"./images/icon-192.png",
"./images/icon-512.png",
  "./images/icon-maskable-512.png",
  "./index.html",
  "./images/kanave-kavithaiye.jpg",
  "./manifest.json",
"./images/nigalvu.jpg",
  "./offline.html",
  "./images/profile.png",
  "./robots.txt",
  "./sitemap.xml",
 "./images/spotify.png",
"./images/youtube.png"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;

  // Never cache streamed/partial audio requests.
  if (
    request.headers.has('range') ||
    request.destination === 'audio' ||
    request.url.includes('/songs/')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Only cache complete successful responses.
        if (response.ok && response.status === 200) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached;

          if (request.mode === 'navigate') {
            return caches.match('./offline.html');
          }

          return Response.error();
        })
      )
  );
});