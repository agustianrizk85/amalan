/* Amalan Harian — Service Worker
   Strategy:
   - Static assets (JS, CSS, HTML, font) → cache-first
   - API (/api/*) → network-first (fallback ke last cache)
   - Quran JSON chunk → cache-first (file besar, jarang berubah)
*/
const VERSION = "amalan-v14-20260521-manifest-clean";
const STATIC_CACHE = `${VERSION}-static`;
const API_CACHE = `${VERSION}-api`;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-192.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  // API: network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(API_CACHE).then((c) => c.put(req, clone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || new Response(JSON.stringify({ offline: true }), { headers: { "content-type": "application/json" } })))
    );
    return;
  }

  // Static: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && res.status === 200) {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match("/"));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
