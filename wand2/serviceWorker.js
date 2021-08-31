const BUBBLEWAND_CACHE = "bubblewand-pwa-v1"
const BUBBLEWAND_ASSETS = [
//   "index.html",
//   "style.css",
//   "app.js",
  "image/error.png",
  "image/error2.png",
  "image/pause.png",
  "image/wand_instruction.gif",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(BUBBLEWAND_CACHE).then(cache => {
      cache.addAll(BUBBLEWAND_ASSETS)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })