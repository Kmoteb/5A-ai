// 📁 system5a-events.js
// إدارة أحداث التطبيق بطريقة منظمة وآمنة

const EventManager = {
    listeners: new Map(),
    
    // إضافة مستمع حدث مع تتبع للحذف الآمن
    addEventListener(element, eventType, handler, options = {}) {
        if (!element) return false;
        
        const key = `${eventType}_${Math.random()}`;
        
        try {
            element.addEventListener(eventType, handler, options);
            
            // تخزين المرجع للحذف لاحقاً
            if (!this.listeners.has(element)) {
                this.listeners.set(element, []);
            }
            
            this.listeners.get(element).push({
                key,
                eventType,
                handler,
                options
            });
            
            console.log(`✓ تم إضافة مستمع حدث: ${eventType}`);
            return key;
        } catch (error) {
            console.error(`❌ خطأ في إضافة مستمع الحدث: ${error.message}`);
            return null;
        }
    },
    
    // إزالة مستمع حدث بأمان
    removeEventListener(element, eventType, handler) {
        if (!element) return false;
        
        try {
            element.removeEventListener(eventType, handler);
            
            if (this.listeners.has(element)) {
                const events = this.listeners.get(element);
                const index = events.findIndex(e => e.eventType === eventType);
                if (index !== -1) {
                    events.splice(index, 1);
                }
            }
            
            console.log(`✓ تم إزالة مستمع الحدث: ${eventType}`);
            return true;
        } catch (error) {
            console.error(`❌ خطأ في إزالة مستمع الحدث: ${error.message}`);
            return false;
        }
    },
    
    // إزالة جميع مستمعي الأحداث لعنصر
    removeAllListeners(element) {
        if (!this.listeners.has(element)) return;
        
        const events = this.listeners.get(element);
        events.forEach(({ eventType, handler, options }) => {
            try {
                element.removeEventListener(eventType, handler, options);
            } catch (error) {
                console.error(`❌ خطأ في إزالة الحدث: ${error.message}`);
            }
        });
        
        this.listeners.delete(element);
        console.log(`✓ تم إزالة جميع مستمعي الأحداث`);
    },
    
    // استهداف أحداث الأزرار بأمان
    setupButtonEvents() {
        // زر تحليل الضربة
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            this.addEventListener(analyzeBtn, 'click', (e) => {
                e.preventDefault();
                if (window.aiEngine && window.aiEngine.analyzeShot) {
                    window.aiEngine.analyzeShot();
                }
            });
        }
        
        // زر حفظ الضربة
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            this.addEventListener(saveBtn, 'click', (e) => {
                e.preventDefault();
                if (window.stateManager && window.stateManager.addToLibrary) {
                    window.stateManager.addToLibrary();
                }
            });
        }
        
        // زر تنظيف النموذج
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            this.addEventListener(clearBtn, 'click', (e) => {
                e.preventDefault();
                this.clearFormInputs();
            });
        }
        
        console.log('✓ تم إعداد أحداث الأزرار');
    },
    
    // استهداف أحداث النماذج
    setupFormEvents() {
        const form = document.getElementById('shotForm');
        if (!form) return;
        
        // حدث التقديم
        this.addEventListener(form, 'submit', (e) => {
            e.preventDefault();
            if (window.aiEngine) {
                window.aiEngine.analyzeShot();
            }
        });
        
        // أحداث المدخلات (للتحقق الفوري)
        const inputs = form.querySelectorAll('input[type="number"], textarea');
        inputs.forEach(input => {
            this.addEventListener(input, 'change', (e) => {
                this.validateInput(e.target);
            });
            
            this.addEventListener(input, 'blur', (e) => {
                this.validateInput(e.target);
            });
        });
        
        console.log('✓ تم إعداد أحداث النموذج');
    },
    
    // التحقق من صحة المدخل
    validateInput(input) {
        if (!input) return false;
        
        // إزالة رسالة الخطأ السابقة إن وجدت
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
        
        // التحقق من القيمة
        const value = input.value.trim();
        const type = input.type;
        
        if (!value) {
            this.showFieldError(input, 'هذا الحقل مطلوب');
            return false;
        }
        
        if (type === 'number') {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                this.showFieldError(input, 'يجب إدخال رقم موجب');
                return false;
            }
        }
        
        input.classList.add('valid');
        return true;
    },
    
    // عرض رسالة خطأ بجانب الحقل
    showFieldError(input, message) {
        input.classList.remove('valid');
        input.classList.add('error');
        
        const errorDiv = document.createElement('small');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    },
    
    // مسح المدخلات
    clearFormInputs() {
        const form = document.getElementById('shotForm');
        if (!form) return;
        
        form.reset();
        
        // إزالة رسائل الخطأ وفئات التحقق
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('valid', 'error');
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
        
        console.log('✓ تم مسح المدخلات');
    },
    
    // استهداف أحداث التبويبات
    setupTabEvents() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const tabName = btn.dataset.tab;
                if (window.UIManager && window.UIManager.switchTab) {
                    window.UIManager.switchTab(tabName);
                }
            });
        });
        
        console.log('✓ تم إعداد أحداث التبويبات');
    },
    
    // إعداد جميع الأحداث
    initializeAllEvents() {
        console.log('🚀 جاري إعداد أحداث التطبيق...');
        
        try {
            this.setupButtonEvents();
            this.setupFormEvents();
            this.setupTabEvents();
            
            console.log('✅ تم إعداد جميع الأحداث بنجاح');
            return true;
        } catch (error) {
            console.error(`❌ خطأ في إعداد الأحداث: ${error.message}`);
            return false;
        }
    },
    
    // تنظيف جميع الأحداث عند إغلاق التطبيق
    cleanup() {
        for (let [element, events] of this.listeners.entries()) {
            this.removeAllListeners(element);
        }
        this.listeners.clear();
        console.log('✓ تم تنظيف جميع الأحداث');
    }
};

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}
