#!/bin/bash
# 🧪 اختبار سريع للتحقق من التحسينات

echo "🧪 اختبار التحسينات الأمنية والمعمارية v2.0"
echo "═════════════════════════════════════════════"
echo ""

# العداد
TOTAL=0
PASSED=0
FAILED=0

# دالة الاختبار
test_file() {
    local file=$1
    local description=$2
    
    echo -n "✓ اختبار: $description ... "
    TOTAL=$((TOTAL+1))
    
    if [ -f "$file" ]; then
        echo "✅ موجود"
        PASSED=$((PASSED+1))
    else
        echo "❌ غير موجود"
        FAILED=$((FAILED+1))
    fi
}

# اختبار الملفات الموديولية
echo "📁 الملفات الموديولية:"
echo "─────────────────────"
test_file "security-utils.js" "security-utils.js"
test_file "system5a-state.js" "system5a-state.js"
test_file "system5a-ui.js" "system5a-ui.js"
test_file "system5a-events.js" "system5a-events.js"
test_file "system5a-storage.js" "system5a-storage.js"
echo ""

# اختبار الإعدادات
echo "⚙️  إعدادات البناء:"
echo "─────────────────"
test_file "vite.config.js" "vite.config.js"
test_file "package.json" "package.json"
echo ""

# اختبار الواجهات
echo "🎯 الواجهات:"
echo "──────────"
test_file "index-v2.html" "index-v2.html (الواجهة المحسّنة)"
test_file "index.html" "index.html (الواجهة الأصلية)"
echo ""

# اختبار التوثيق
echo "📚 التوثيق:"
echo "─────────"
test_file "FINAL-SUMMARY.md" "FINAL-SUMMARY.md"
test_file "QUICK-START.md" "QUICK-START.md"
test_file "SECURITY-IMPROVEMENTS.md" "SECURITY-IMPROVEMENTS.md"
test_file "COMPREHENSIVE-REPORT.md" "COMPREHENSIVE-REPORT.md"
test_file "VERSION-2-SUMMARY.md" "VERSION-2-SUMMARY.md"
echo ""

# اختبار الملفات المحسّنة
echo "🔧 الملفات المحسّنة:"
echo "─────────────────"
test_file "5a-ai.js" "5a-ai.js (بدون eval)"
test_file "5a-core.js" "5a-core.js (بدون innerHTML)"
echo ""

# التحقق من محتويات الملفات
echo "🔍 التحقق من المحتويات:"
echo "───────────────────────"

# التحقق من عدم وجود eval
echo -n "✓ التحقق: عدم وجود eval() في 5a-ai.js ... "
if grep -q "eval(" 5a-ai.js; then
    echo "❌ لا يزال يحتوي على eval"
    FAILED=$((FAILED+1))
else
    echo "✅ تم حذف eval()"
    PASSED=$((PASSED+1))
fi
TOTAL=$((TOTAL+1))

# التحقق من عدم وجود innerHTML في 5a-core.js
echo -n "✓ التحقق: عدم وجود innerHTML في 5a-core.js ... "
# تتجاهل الاستخدامات في التعليقات والتوثيق
if grep -E "\.innerHTML\s*=" 5a-core.js | grep -v "^[[:space:]]*\/\/" > /dev/null; then
    echo "❌ لا يزال يحتوي على innerHTML"
    FAILED=$((FAILED+1))
else
    echo "✅ تم استبدال innerHTML"
    PASSED=$((PASSED+1))
fi
TOTAL=$((TOTAL+1))

# التحقق من وجود evaluateRuleSafely
echo -n "✓ التحقق: وجود evaluateRuleSafely() في 5a-ai.js ... "
if grep -q "evaluateRuleSafely" 5a-ai.js; then
    echo "✅ موجود"
    PASSED=$((PASSED+1))
else
    echo "❌ غير موجود"
    FAILED=$((FAILED+1))
fi
TOTAL=$((TOTAL+1))

# التحقق من وجود ARIA attributes
echo -n "✓ التحقق: وجود ARIA labels في index-v2.html ... "
if grep -q "aria-label" index-v2.html; then
    echo "✅ موجود"
    PASSED=$((PASSED+1))
else
    echo "❌ غير موجود"
    FAILED=$((FAILED+1))
fi
TOTAL=$((TOTAL+1))

# التحقق من وجود Vite config
echo -n "✓ التحقق: وجود Vite configuration ... "
if grep -q "defineConfig" vite.config.js; then
    echo "✅ موجود"
    PASSED=$((PASSED+1))
else
    echo "❌ غير موجود"
    FAILED=$((FAILED+1))
fi
TOTAL=$((TOTAL+1))

echo ""
echo "═════════════════════════════════════════════"
echo "📊 النتائج النهائية:"
echo "═════════════════════════════════════════════"
echo ""
echo "  ✅ نجح:  $PASSED"
echo "  ❌ فشل:  $FAILED"
echo "  📊 الإجمالي: $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 جميع الاختبارات نجحت! ✅"
    echo ""
    echo "النسخة 2.0.0 جاهزة للإنتاج 🚀"
    exit 0
else
    echo "⚠️  هناك $FAILED اختبار(ات) فشل"
    exit 1
fi
