// Peeyem Traders Admin Service Worker
const CACHE_NAME = "pt-admin-v1.0.0";

const PRECACHE_ASSETS = [
  "/admin/login",
  "/admin-manifest.json",
  "/logo.svg",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// Install: precache critical shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[Admin SW] Precache failed:", err))
  );
});

// Activate: clean old caches & claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch Strategy:
// - Skip API, Firebase, and non-GET requests
// - For /admin pages: Network-first with cache fallback
// - For static assets (images, fonts, scripts): Stale-while-revalidate
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== "GET") return;

  // Do not intercept external analytics or API calls
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("firebase") ||
    url.hostname.includes("google-analytics") ||
    url.hostname.includes("googletagmanager")
  ) {
    return;
  }

  // Admin HTML Navigation: Network-First
  if (req.mode === "navigate" && url.pathname.startsWith("/admin")) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match("/admin/login");
          if (fallback) return fallback;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Peeyem Admin - Offline</title>
              <style>
                body { background: #070c12; color: #cbd5e1; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                .card { background: #0e1720; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1.5rem; max-width: 400px; }
                h1 { color: #ff8d28; margin: 0 0 0.5rem; font-size: 1.5rem; }
                p { font-size: 0.875rem; color: #94a3b8; }
                button { margin-top: 1.5rem; background: #ff8d28; color: #020617; border: none; font-weight: bold; padding: 0.6rem 1.25rem; border-radius: 0.75rem; cursor: pointer; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Connection Lost</h1>
                <p>Peeyem Admin cannot reach the network. Please check your internet connection.</p>
                <button onclick="window.location.reload()">Retry Connection</button>
              </div>
            </body>
            </html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Static Assets (Images, Next.js chunks, Icons): Stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp")
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
