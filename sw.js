// PORTAL app: laging kinukuha ang bagong index.html sa internet.
// Kapag walang internet, ang huling nakuhang index.html ang bubuksan.
const CACHE = "portal-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.mode !== "navigate" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok && /\/(index\.html)?$/.test(new URL(res.url).pathname)) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put("index.html", copy));
    }
    return res;
  }).catch(() => caches.open(CACHE).then(c => c.match("index.html")).then(m => m || Response.error())));
});
