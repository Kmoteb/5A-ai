// 📁 system5a-storage.js
// إدارة تخزين قاعدة بيانات IndexedDB بطريقة آمنة مع معالجة الأخطاء

const StorageManager = {
    dbName: '5A-AI-DB',
    dbVersion: 1,
    storeName: 'shots',
    db: null,
    
    // فتح قاعدة البيانات بأمان
    async initDatabase() {
        return new Promise((resolve, reject) => {
            try {
                // التحقق من توفر IndexedDB
                const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
                
                if (!indexedDB) {
                    throw new Error('IndexedDB غير مدعوم في المتصفح');
                }
                
                const request = indexedDB.open(this.dbName, this.dbVersion);
                
                // معالج الخطأ
                request.onerror = () => {
                    console.error('❌ خطأ في فتح قاعدة البيانات:', request.error);
                    reject(new Error(`فتح قاعدة البيانات فشل: ${request.error.message}`));
                };
                
                // معالج النجاح
                request.onsuccess = () => {
                    this.db = request.result;
                    console.log('✓ تم فتح قاعدة البيانات بنجاح');
                    resolve(this.db);
                };
                
                // معالج الترقية (أول مرة)
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // إنشاء المخزن
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                        
                        // إنشاء فهارس
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                        store.createIndex('rails', 'rails', { unique: false });
                        store.createIndex('success', 'success', { unique: false });
                        
                        console.log('✓ تم إنشاء المخزن والفهارس');
                    }
                };
                
            } catch (error) {
                console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
                reject(error);
            }
        });
    },
    
    // حفظ البيانات بأمان
    async saveShot(shot) {
        if (!this.db) {
            console.warn('⚠️ قاعدة البيانات غير مهيأة، جاري الحفظ المحلي');
            return this.saveFallback(shot);
        }
        
        return new Promise((resolve, reject) => {
            try {
                // التحقق من صحة البيانات
                if (!shot || typeof shot !== 'object') {
                    throw new Error('البيانات غير صحيحة');
                }
                
                // إضافة طابع زمني
                shot.timestamp = Date.now();
                
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.add(shot);
                
                request.onerror = () => {
                    console.error('❌ خطأ في حفظ البيانات:', request.error);
                    reject(new Error(`حفظ البيانات فشل: ${request.error.message}`));
                };
                
                request.onsuccess = () => {
                    console.log('✓ تم حفظ البيانات بنجاح');
                    resolve(request.result);
                };
                
                transaction.onerror = () => {
                    console.error('❌ خطأ في معاملة قاعدة البيانات');
                    reject(new Error('فشلت معاملة قاعدة البيانات'));
                };
                
            } catch (error) {
                console.error('❌ خطأ في حفظ البيانات:', error);
                reject(error);
            }
        });
    },
    
    // استرجاع جميع البيانات بأمان
    async getAllShots() {
        if (!this.db) {
            return this.loadFallback();
        }
        
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();
                
                request.onerror = () => {
                    console.error('❌ خطأ في قراءة البيانات:', request.error);
                    reject(new Error(`قراءة البيانات فشلت: ${request.error.message}`));
                };
                
                request.onsuccess = () => {
                    console.log(`✓ تم استرجاع ${request.result.length} ضربة`);
                    resolve(request.result);
                };
                
            } catch (error) {
                console.error('❌ خطأ في استرجاع البيانات:', error);
                reject(error);
            }
        });
    },
    
    // حذف بيانات بأمان
    async deleteShot(id) {
        if (!this.db) {
            return this.deleteFallback(id);
        }
        
        return new Promise((resolve, reject) => {
            try {
                // التحقق من صحة المعرف
                if (!Number.isInteger(id) || id < 1) {
                    throw new Error('معرف غير صحيح');
                }
                
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(id);
                
                request.onerror = () => {
                    console.error('❌ خطأ في حذف البيانات:', request.error);
                    reject(new Error(`حذف البيانات فشل: ${request.error.message}`));
                };
                
                request.onsuccess = () => {
                    console.log('✓ تم حذف البيانات بنجاح');
                    resolve();
                };
                
            } catch (error) {
                console.error('❌ خطأ في حذف البيانات:', error);
                reject(error);
            }
        });
    },
    
    // البحث بأمان
    async searchShots(query, field = 'rails') {
        if (!this.db) {
            return this.searchFallback(query, field);
        }
        
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const index = store.index(field);
                const request = index.getAll(query);
                
                request.onerror = () => {
                    console.error('❌ خطأ في البحث:', request.error);
                    reject(new Error(`البحث فشل: ${request.error.message}`));
                };
                
                request.onsuccess = () => {
                    console.log(`✓ تم العثور على ${request.result.length} نتيجة`);
                    resolve(request.result);
                };
                
            } catch (error) {
                console.error('❌ خطأ في البحث:', error);
                reject(error);
            }
        });
    },
    
    // تصفية البيانات
    async filterShots(criteria) {
        const allShots = await this.getAllShots();
        
        return allShots.filter(shot => {
            // التحقق من المعايير
            if (criteria.minSuccess && shot.success < criteria.minSuccess) return false;
            if (criteria.maxSuccess && shot.success > criteria.maxSuccess) return false;
            if (criteria.rails && shot.rails !== criteria.rails) return false;
            if (criteria.startDate && shot.timestamp < criteria.startDate) return false;
            if (criteria.endDate && shot.timestamp > criteria.endDate) return false;
            
            return true;
        });
    },
    
    // مسح قاعدة البيانات بأمان
    async clearDatabase() {
        if (!this.db) return true;
        
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();
                
                request.onerror = () => {
                    console.error('❌ خطأ في مسح قاعدة البيانات:', request.error);
                    reject(new Error(`مسح البيانات فشل: ${request.error.message}`));
                };
                
                request.onsuccess = () => {
                    console.log('✓ تم مسح قاعدة البيانات');
                    resolve();
                };
                
            } catch (error) {
                console.error('❌ خطأ في مسح قاعدة البيانات:', error);
                reject(error);
            }
        });
    },
    
    // ========== الخيارات البديلة (Fallback) ==========
    
    // حفظ في localStorage كبديل
    saveFallback(shot) {
        try {
            let shots = JSON.parse(localStorage.getItem('5a-shots') || '[]');
            shot.id = Date.now();
            shots.push(shot);
            
            // الحفاظ على آخر 100 ضربة فقط
            if (shots.length > 100) {
                shots = shots.slice(-100);
            }
            
            localStorage.setItem('5a-shots', JSON.stringify(shots));
            console.log('✓ تم الحفظ في localStorage');
            return shot.id;
        } catch (error) {
            console.error('❌ خطأ في الحفظ البديل:', error);
            throw error;
        }
    },
    
    // تحميل من localStorage
    loadFallback() {
        try {
            const data = localStorage.getItem('5a-shots');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ خطأ في التحميل البديل:', error);
            return [];
        }
    },
    
    // حذف من localStorage
    deleteFallback(id) {
        try {
            let shots = JSON.parse(localStorage.getItem('5a-shots') || '[]');
            shots = shots.filter(s => s.id !== id);
            localStorage.setItem('5a-shots', JSON.stringify(shots));
            console.log('✓ تم الحذف من localStorage');
            return true;
        } catch (error) {
            console.error('❌ خطأ في الحذف البديل:', error);
            return false;
        }
    },
    
    // بحث في localStorage
    searchFallback(query, field) {
        try {
            const shots = this.loadFallback();
            return shots.filter(shot => shot[field] === query);
        } catch (error) {
            console.error('❌ خطأ في البحث البديل:', error);
            return [];
        }
    }
};

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
