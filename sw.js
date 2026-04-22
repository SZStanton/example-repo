// Cache name version, it is changed on updating cached files
const CACHE_NAME = 'ecommerce-cache-v3';

// Files or links stored in cache
const urlsToCache = [
  'index.html',
  'style.css',
  'script.js',
  'https://www.easygetproduct.com/wp-content/uploads/2019/03/9.-VicTsing-MM057-2.4G-Wireless-Portable-Mobile-Mouse-Optical-Mice-with-USB-Receiver-5-Adjustable-DPI-Levels-6-Buttons-for-Notebook-PC-Laptop-Computer-Black-1.jpg',
  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6539/6539505_sd.jpg',
  'https://i5.walmartimages.com/seo/VILINICE-Noise-Cancelling-Headphones-Wireless-Bluetooth-Over-Ear-Headphones-with-Microphone-Black-Q8_0cd6ae5a-8ea9-4e46-8b5e-fffb7da5e6f5.d4808578fda9397ec198b2d5dec46404.jpeg?odnHeight=424&odnWidth=424&odnBg=FFFFFF',
];

// Install Event, runs when the service worker is first installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
  );
});

// Fetch Event, intercepts network requests and serves cached version if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  );
});
