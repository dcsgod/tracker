/**
 * sw.js — Mastery Tracker Service Worker
 * Strategy: Cache-first for static assets, network-first for data JSONs
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `mastery-static-${CACHE_VERSION}`;
const DATA_CACHE   = `mastery-data-${CACHE_VERSION}`;

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/tracker/',
  '/tracker/index.html',
];

// Data files to cache on first fetch (network-first, then cache)
const DATA_PATHS = [
  '/tracker/data/cp-topics.json',
  '/tracker/data/roadmaps/mlpath.json',
  '/tracker/data/roadmaps/nlppath.json',
  '/tracker/data/roadmaps/llmreasoning.json',
  '/tracker/data/roadmaps/timeseriespath.json',
  '/tracker/data/roadmaps/quantpath.json',
  '/tracker/data/roadmaps/gnnpath.json',
  '/tracker/data/roadmaps/rlpath.json',
  '/tracker/data/roadmaps/diffusionmodelspath.json',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DATA_CACHE)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin (e.g. Codeforces API, GitHub API)
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Data JSONs: network-first, fall back to cache
  if (DATA_PATHS.some(p => url.pathname === p) || url.pathname.startsWith('/tracker/data/')) {
    event.respondWith(networkFirstWithCache(request, DATA_CACHE));
    return;
  }

  // Static assets (JS, CSS, icons, index.html): cache-first
  event.respondWith(cacheFirstWithNetwork(request, STATIC_CACHE));
});

// ─── Strategies ─────────────────────────────────────────────────────────────

async function cacheFirstWithNetwork(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not in cache — return offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const fallback = await caches.match('/tracker/');
      return fallback ?? new Response('Offline — open the app while online first.', {
        status: 503, headers: { 'Content-Type': 'text/plain' }
      });
    }
    throw new Error('Offline');
  }
}

async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
