const CACHE_NAME = 'sypriyan-v1';
const APP_SHELL = [
  "./",
  "./album-cover.png",
  "./amazon.png",
  "./apple.png",
  "./dharman-sky-is-ours.png",
  "./favicon.png",
  "./googlee11d77b56efe7208.html",
  "./hero-desktop.png",
  "./hero-mobile.png",
  "./hero.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./index.html",
  "./kanave-kavithaiye.jpg",
  "./manifest.json",
  "./nigalvu.jpg",
  "./offline.html",
  "./profile.png",
  "./robots.txt",
  "./sitemap.xml",
  "./spotify.png",
  "./youtube.png"
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
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || (event.request.mode === 'navigate' ? caches.match('./offline.html') : Response.error())))
  );
});
