#!/bin/bash
# 5A-ai Development Helper Script

set -e

echo "🚀 5A AI Development Helper"
echo "=========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
show_menu() {
    echo ""
    echo "اختر عملية:"
    echo "1. بدء خادم محلي (localhost:8000)"
    echo "2. بدء خادم تطوير (localhost:8080)"
    echo "3. فحص الملفات"
    echo "4. عرض الإحصائيات"
    echo "5. تنظيف ذاكرة التخزين المؤقت"
    echo "6. خروج"
    echo ""
}

start_server() {
    local port=$1
    echo -e "${GREEN}✓ بدء الخادم على المنفذ $port${NC}"
    echo "الرابط: http://localhost:$port"
    python3 -m http.server $port
}

show_stats() {
    echo -e "${YELLOW}📊 إحصائيات المشروع:${NC}"
    echo "عدد ملفات JavaScript:"
    find . -name "*.js" -type f | wc -l
    echo "عدد ملفات CSS:"
    find . -name "*.css" -type f | wc -l
    echo "عدد ملفات HTML:"
    find . -name "*.html" -type f | wc -l
    echo ""
    echo "إجمالي حجم الملفات:"
    du -sh .
}

check_files() {
    echo -e "${YELLOW}🔍 فحص الملفات الأساسية:${NC}"
    
    local files=(
        "index.html"
        "5a-core.js"
        "5A-ai.js"
        "5A-style.css"
        "manifest.json"
        "service-worker.js"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✓${NC} $file"
        else
            echo -e "${RED}✗${NC} $file (مفقود)"
        fi
    done
}

clean_cache() {
    echo -e "${YELLOW}🧹 تنظيف الذاكرة:${NC}"
    rm -rf .cache/
    rm -rf .parcel-cache/
    rm -rf *.tmp
    echo -e "${GREEN}✓ تم التنظيف${NC}"
}

# Main loop
while true; do
    show_menu
    read -p "اختيارك: " choice
    
    case $choice in
        1)
            start_server 8000
            ;;
        2)
            start_server 8080
            ;;
        3)
            check_files
            ;;
        4)
            show_stats
            ;;
        5)
            clean_cache
            ;;
        6)
            echo -e "${GREEN}وداعاً!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}اختيار غير صحيح${NC}"
            ;;
    esac
done
