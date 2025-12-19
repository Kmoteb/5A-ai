// Service Worker لتطبيق 5A AI - النسخة المحسّنة
const CACHE_NAME = '5a-ai-v2.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index-v2.html',
  './index.html',
  './5A-style.css',
  './5a-core.js',
  './5A-ai.js',
  './security-utils.js',
  './system5a-state.js',
  './system5a-ui.js',
  './system5a-events.js',
  './system5a-storage.js',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './vite.config.js',
  './package.json',
  // ملفات الواجهة
  './table-editor.html',
  './test.html',
  './sw-test.html',
  // ملفات التوثيق
  './README.md',
  './QUICK-START.md',
  './SECURITY-IMPROVEMENTS.md',
  // خطوط خارجية (ستُحمل عند الحاجة)
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
  // تجاهل طلبات غير GET
  if (event.request.method !== 'GET') return;

  // تجاهل طلبات API خارجية
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.includes('fonts.googleapis.com') &&
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // إرجاع النسخة المخزنة
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // تحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // تخزين النسخة الجديدة
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              })
              .catch(err => {
                console.warn('⚠️ فشل في تخزين:', event.request.url, err);
              });

            return response;
          })
          .catch(() => {
            // في حالة عدم الاتصال، إرجاع صفحة بديلة
            if (event.request.destination === 'document') {
              return caches.match('./index-v2.html');
            }

            // إرجاع صورة بديلة للأيقونات
            if (event.request.destination === 'image') {
              return new Response('', { status: 404 });
            }
          });
      })
  );
});

// التعامل مع الرسائل
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// معالجة الأخطاء
self.addEventListener('error', event => {
  console.error('❌ خطأ في Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ Promise مرفوض في Service Worker:', event.reason);
});

console.log('⚡ Service Worker لـ 5A AI v2.0.0 يعمل بنجاح');