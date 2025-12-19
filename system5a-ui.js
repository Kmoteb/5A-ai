// 📁 system5a-ui.js
// إدارة واجهة المستخدم بطريقة آمنة

const UIManager = {
    // عرض نتائج التحليل بطريقة آمنة
    renderAnalysisResults(analysis) {
        const resultsDiv = document.getElementById('analysisResults');
        if (!resultsDiv) return;
        
        // مسح المحتوى القديم بأمان
        while (resultsDiv.firstChild) {
            resultsDiv.removeChild(resultsDiv.firstChild);
        }
        
        // إنشاء عناصر HTML بطريقة آمنة (بدون innerHTML)
        const container = document.createElement('div');
        container.className = 'analysis-container';
        
        // العنوان
        const title = document.createElement('h3');
        title.textContent = 'نتائج التحليل';
        container.appendChild(title);
        
        // النتيجة الرئيسية
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-box';
        
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `نسبة النجاح المتوقعة: ${analysis.successRate}%`;
        resultDiv.appendChild(scoreSpan);
        
        container.appendChild(resultDiv);
        
        // التوصيات
        if (analysis.recommendations && analysis.recommendations.length > 0) {
            const recsTitle = document.createElement('h4');
            recsTitle.textContent = 'التوصيات:';
            container.appendChild(recsTitle);
            
            const recsList = document.createElement('ul');
            analysis.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                recsList.appendChild(li);
            });
            container.appendChild(recsList);
        }
        
        resultsDiv.appendChild(container);
        resultsDiv.style.display = 'block';
        
        console.log('✓ تم عرض نتائج التحليل');
    },
    
    // عرض المكتبة بطريقة آمنة
    renderLibrary(shots) {
        const listContainer = document.getElementById('libraryList');
        if (!listContainer) return;
        
        // مسح المحتوى القديم
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
        
        if (shots.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.textContent = 'لا توجد ضربات محفوظة بعد';
            listContainer.appendChild(emptyDiv);
            return;
        }
        
        shots.forEach(shot => {
            const item = document.createElement('div');
            item.className = 'library-item';
            item.role = 'listitem';
            
            // المحتوى (نص آمن بدون HTML)
            const content = document.createElement('div');
            content.className = 'item-content';
            
            const rails = document.createElement('span');
            rails.textContent = `الجدران: ${shot.rails}`;
            content.appendChild(rails);
            
            const notes = document.createElement('small');
            notes.textContent = shot.notes || 'بدون ملاحظات';
            content.appendChild(notes);
            
            item.appendChild(content);
            listContainer.appendChild(item);
        });
        
        console.log(`✓ تم عرض ${shots.length} ضربة`);
    },
    
    // عرض الإخطارات بطريقة آمنة
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        
        // نص آمن
        const text = document.createElement('span');
        text.textContent = message;
        notification.appendChild(text);
        
        document.body.appendChild(notification);
        
        // إزالة تلقائية
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    // تحديث التبويبات
    switchTab(tabName) {
        // إخفاء جميع التبويبات
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // إظهار التبويب المطلوب
        const activeTab = document.getElementById(`${tabName}Panel`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // تحديث أزرار التنقل
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        console.log(`✓ تم الانتقال إلى تبويب: ${tabName}`);
    },
    
    // إظهار شاشة التحميل
    showLoadingScreen(message) {
        const loadingProgress = document.getElementById('loadingProgress');
        if (loadingProgress) {
            loadingProgress.textContent = message;
        }
    },
    
    // إخفاء شاشة التحميل
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
};

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
