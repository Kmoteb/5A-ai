// 📁 system5a-state.js
// إدارة الحالة والبيانات

const StateManager = {
    // الحالة الحالية
    state: {
        currentShot: {
            rails: 3,
            whiteBallMeasurement: 1.25,
            aimMeasurement: 7,
            cueMeasurement: null,
            pathMeasurement: null,
            notes: ''
        },
        library: [],
        filters: {
            rails: null,
            searchTerm: ''
        }
    },
    
    // تحديث الحالة بأمان
    updateShot(fields) {
        try {
            this.state.currentShot = { ...this.state.currentShot, ...fields };
            this.saveToStorage();
            console.log('✓ تم تحديث الضربة الحالية');
        } catch (e) {
            console.error('❌ خطأ في تحديث الضربة:', e);
        }
    },
    
    // إضافة ضربة للمكتبة
    addToLibrary(shot) {
        try {
            const newShot = {
                ...shot,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            this.state.library.push(newShot);
            this.saveToStorage();
            console.log(`✓ تمت إضافة ضربة جديدة (ID: ${newShot.id})`);
            return newShot;
        } catch (e) {
            console.error('❌ خطأ في إضافة الضربة:', e);
        }
    },
    
    // الحصول على الضربات المفلترة
    getFilteredShots() {
        let shots = [...this.state.library];
        
        if (this.state.filters.rails) {
            shots = shots.filter(s => s.rails === this.state.filters.rails);
        }
        
        if (this.state.filters.searchTerm) {
            const term = this.state.filters.searchTerm.toLowerCase();
            shots = shots.filter(s => 
                s.notes?.toLowerCase().includes(term)
            );
        }
        
        return shots;
    },
    
    // تطبيق عامل التصفية
    applyFilter(type, value) {
        this.state.filters[type] = value;
        console.log(`✓ تم تطبيق عامل التصفية: ${type} = ${value}`);
    },
    
    // حفظ في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem('5a-state', JSON.stringify(this.state));
        } catch (e) {
            console.warn('⚠️ فشل حفظ في localStorage:', e);
        }
    },
    
    // تحميل من التخزين المحلي
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('5a-state');
            if (saved) {
                this.state = JSON.parse(saved);
                console.log('✓ تم تحميل الحالة المحفوظة');
            }
        } catch (e) {
            console.warn('⚠️ فشل تحميل من localStorage:', e);
        }
    },
    
    // مسح كل البيانات
    clearAll() {
        if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
            this.state.library = [];
            this.state.currentShot = {};
            localStorage.removeItem('5a-state');
            console.log('✓ تم مسح جميع البيانات');
        }
    }
};

// الحفظ الدوري
setInterval(() => StateManager.saveToStorage(), 30000);
