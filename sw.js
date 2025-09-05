const CACHE_NAME = 'quick-colors-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap'
];

// هذا الحدث يتم تشغيله عند تثبيت الـ Service Worker لأول مرة.
// يقوم بتخزين الملفات الأساسية للعبة في الذاكرة المؤقتة (cache).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Failed to cache some files', error);
      });
    })
  );
});

// هذا الحدث يتم تشغيله في كل مرة يطلب فيها المستخدم شيئًا من التطبيق.
// يتحقق مما إذا كان الملف موجودًا في الذاكرة المؤقتة، وإذا كان كذلك، يعيده بسرعة.
// إذا لم يكن موجودًا، يجلبه من الشبكة.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا كان المورد موجودًا في الكاش، قم بإرجاعه.
      if (response) {
        return response;
      }
      // وإلا، قم بجلبه من الشبكة.
      return fetch(event.request);
    }).catch((error) => {
      console.error('Fetch failed:', error);
    })
  );
});

// هذا الحدث يتم تشغيله عند تفعيل الـ Service Worker.
// يقوم بمسح أي نسخ قديمة من الكاش للتأكد من استخدام النسخة الأحدث فقط.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // حذف الكاش القديم
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});