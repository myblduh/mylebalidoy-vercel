const CACHE = "portfolio-v1";
const OFFLINE_URLS = ["/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(OFFLINE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Never touch non-GET, cross-origin, or private gallery/API requests.
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/gallery")) return;

  if (req.mode === "navigate") {
    // Network first, fall back to cached home page when offline.
    e.respondWith(fetch(req).catch(() => caches.match("/")));
    return;
  }

  // Static assets: stale-while-revalidate.
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/assets")) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        const net = fetch(req).then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      }),
    );
  }
});
