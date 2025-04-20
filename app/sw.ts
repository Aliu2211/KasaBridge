/// <reference lib="webworker" />

// This service worker can be customized
// https://developers.google.com/web/tools/workbox/modules

declare const self: ServiceWorkerGlobalScope

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("kasabridge-v1").then((cache) => {
      return cache.addAll(["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"])
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old caches if needed
            return cacheName !== "kasabridge-v1"
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          }),
      )
    }),
  )
})

export {}
