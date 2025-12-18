# دليل المطور - 5A AI

## البدء السريع

### 1. تشغيل الخادم

```bash
# خادم بسيط على المنفذ 8000
python3 -m http.server 8000

# أو استخدام make
make server

# أو استخدام الملف المساعد
bash dev-helper.sh
```

### 2. فتح التطبيق

```bash
http://localhost:8000
```

## البنية

```
5A-ai/
├── index.html              # الصفحة الرئيسية
├── 5A-style.css           # الأنماط الرئيسية
├── 5a-core.js             # نظام التحكم
├── 5A-ai.js               # محرك AI
├── table-manager.js       # مدير الجداول
├── advanced-tables.js     # جداول متقدمة
├── rail-systems.js        # أنظمة الجدران
├── geometry-calculator.js # حسابات الهندسة
├── validation-engine.js   # التحقق من الصحة
├── ai-worker.js           # Web Worker للـ AI
├── geometry-worker.js     # Web Worker للهندسة
├── service-worker.js      # Service Worker
├── manifest.json          # PWA manifest
└── README.md              # هذا الملف
```

## المراحل الرئيسية

### التهيئة (Initialization)

1. تحميل الملفات الحاسمة بالترتيب
2. إعداد مستمعي الأحداث
3. تحميل البيانات المحفوظة
4. عرض الواجهة

### المعالجة (Processing)

1. استقبال إدخال المستخدم
2. التحقق من الصحة
3. معالجة في Web Worker (إن أمكن)
4. عرض النتائج

### التخزين (Storage)

1. localStorage (البيانات الأساسية)
2. IndexedDB (البيانات المعقدة)
3. Cloud Sync (اختياري)

## الأخطاء الشائعة وحلولها

### الخطأ: "System5A is not defined"
**الحل**: تأكد من تحميل `5a-core.js` بعد `index.html`

### الخطأ: "Module not found"
**الحل**: تحقق من وجود الملف والامتداد الصحيح

### الخطأ: "localStorage is not available"
**الحل**: استخدم متصفحاً يدعم localStorage

## نصائح التطوير

### إضافة ميزة جديدة
1. أضفها في الملف المناسب
2. اختبرها في console
3. أضف مستمع حدث إذا لزم
4. حدّث التوثيق

### تحسين الأداء
1. استخدم Web Workers للحسابات الثقيلة
2. طبّق Debouncing للأحداث المتكررة
3. استخدم Caching للنتائج المتكررة

### اختبار الميزات

```javascript
// فتح console واختبر:
System5A.analyzeCurrentShot();
window.FiveAAI.analyzeShot({...});
```

## الأوامر المفيدة

```bash
# فحص الملفات
make check-files

# عرض الإحصائيات
make stats

# تنظيف الذاكرة
make clean

# بدء الخادم (Mac/Linux)
bash dev-helper.sh
```

## الموارد

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## الدعم

في حالة الأسئلة:
1. تحقق من console للأخطاء
2. راجع README.md
3. افحص الملفات الأخرى ذات الصلة
4. ابحث عن مشاكل مماثلة

---

آخر تحديث: 2025-12-17
