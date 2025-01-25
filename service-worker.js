const CACHE_NAME = 'to-do-pwa-cache-v1';
const FILES_TO_CACHE = [
 '/RUTH-REPOSITORY/',
 '/RUTH-REPOSITORY /index.html',
 '/RUTH-REPOSITORY /style.css',
 '/RUTH-REPOSITORY/app.js',
 '/RUTH-REPOSITORY /manifest.json',
 '/RUTH-REPOSITORY /icons/icon-128.png',
 '/RUTH-REPOSITORY /icons/icon-512.png'
];
self.addEventListener('install', (event) => {
 event.waitUntil(
 caches.open(CACHE_NAME)
 .then((cache) => cache.addAll(FILES_TO_CACHE))
 );
});
self.addEventListener('fetch', (event) => {
 event.respondWith(
 caches.match(event.request)
 .then((response) => response || fetch(event.request))
 );
});
