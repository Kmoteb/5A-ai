// Service Worker لتطبيق 5A AI
const CACHE_NAME = '5a-ai-v1.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './5A-style.css',
  './5a-core.js',
  './5A-ai.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// التثبيت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 جاري تخزين الملفات مؤقتاً');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// التنشيط
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف المخزن المؤقت القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// طلب الملفات
self.addEventListener('fetch', event => {
  // تجاهل طلبات POST
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // لا تخزن ملفات من مصادر خارجية غير آمنة
            if (!event.request.url.startsWith('http')) {
              return response;
            }
            
            // تخزين الملفات الجديدة
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            
            return response;
          })
          .catch(() => {
            // إذا فشل الاتصال، عد للصفحة الرئيسية
            if (event.request.url.includes('.html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// التعامل مع الرسائل
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('⚡ Service Worker لـ 5A AI يعمل بنجاح');