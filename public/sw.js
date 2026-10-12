const CACHE_PREFIX = "pombal-emprega-static-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const OFFLINE_URL = "/offline.html";
const CORE_ASSETS = [OFFLINE_URL, "/icons/pombal-emprega-192.png", "/icons/pombal-emprega-512.png", "/icons/pombal-emprega-maskable-512.png"];
const MAX_STATIC_ITEMS = 120;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") void self.skipWaiting();
});

function isPublicStaticAsset(url, request) {
  if (url.origin !== self.location.origin || request.method !== "GET") return false;
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (/^\/(images|fonts|icons)\/[^/]+\.(png|jpe?g|webp|svg|woff2?|ttf|otf)$/i.test(url.pathname)) return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // HTML, Server Actions, auth callbacks, Supabase APIs, RSC navigation and user data stay online only.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error()));
    return;
  }
  if (!isPublicStaticAsset(url, request)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const keys = await cache.keys();
      if (keys.length >= MAX_STATIC_ITEMS) await cache.delete(keys[0]);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
