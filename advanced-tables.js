// 📁 advanced-tables.js - نسخة مستقرة ومحسّنة
// الحفاظ على التوافق مع القديم مع إضافة الأمان

// ==================== COMPRESSION FALLBACK ====================
// إضافة LZString بشكل مضمن إن لم يكن موجوداً
if (typeof LZString === 'undefined') {
    // نسخة مبسطة من LZString
    window.LZString = {
        compressToUTF16: function(str) {
            try {
                return btoa(unescape(encodeURIComponent(str)));
            } catch(e) {
                return str; // Fallback
            }
        },
        decompressFromUTF16: function(str) {
            try {
                return decodeURIComponent(escape(atob(str)));
            } catch(e) {
                return str; // Fallback
            }
        }
    };
}

// ==================== BASE CLASS ====================
class BaseRailSystem {
    constructor(systemName) {
        this.systemName = systemName;
        this.storageKey = `${systemName.toLowerCase()}_table`;
        this.optionsKey = `${systemName.toLowerCase()}_whiteBall_options`;
        
        // تهيئة البيانات الافتراضية
        this.initializeDefaults();
        
        // محاولة التحميل مع fallback آمن
        this.safeLoadFromStorage();
    }
    
    // إعداد القيم الافتراضية
    initializeDefaults() {
        this.whiteBallOptions = [];
        this.tableData = {};
    }
    
    // ==================== STORAGE WITH FALLBACK ====================
    safeLoadFromStorage() {
        try {
            // المحاولة 1: مع الضغط
            const savedCompressed = localStorage.getItem(this.storageKey);
            const savedOptions = localStorage.getItem(this.optionsKey);
            
            if (savedCompressed) {
                const decompressed = LZString.decompressFromUTF16(savedCompressed);
                this.tableData = decompressed ? JSON.parse(decompressed) : {};
            }
            
            if (savedOptions) {
                this.whiteBallOptions = JSON.parse(savedOptions);
            }
            
            console.log(`✅ تم تحميل ${this.systemName} بنجاح`);
            
        } catch (e) {
            console.warn(`⚠️ فشل تحميل ${this.systemName}، استخدام افتراضيات:`, e);
            this.initializeDefaults();
        }
    }
    
    safeSaveToStorage() {
        try {
            // التحقق من مساحة التخزين
            const dataStr = JSON.stringify(this.tableData);
            const compressed = LZString.compressToUTF16(dataStr);
            
            // Approximate size check
            if (compressed.length > 2 * 1024 * 1024) { // 2MB limit
                console.error('❌ البيانات كبيرة جداً، لا يمكن الحفظ');
                return false;
            }
            
            localStorage.setItem(this.storageKey, compressed);
            localStorage.setItem(this.optionsKey, JSON.stringify(this.whiteBallOptions));
            
            console.log(`💾 تم حفظ ${this.systemName} بنجاح`);
            return true;
            
        } catch (e) {
            console.error(`❌ فشل حفظ ${this.systemName}:`, e);
            // محاولة حفظ بدون ضغط كـ fallback
            try {
                localStorage.setItem(this.storageKey + '_fallback', JSON.stringify(this.tableData));
                console.log('💾 محفوظ كـ fallback');
            } catch (fallbackError) {
                console.error('❌ Fallback فشل أيضاً:', fallbackError);
            }
            return false;
        }
    }
    
    // ==================== CORE METHODS ====================
    getMeasurements(whiteBall, aim) {
        try {
            // التحقق من المدخلات
            if (whiteBall === undefined || aim === undefined) {
                console.warn('⚠️ قيم غير مكتملة:', { whiteBall, aim });
                return null;
            }
            
            const closestWhiteBall = this.findClosest(whiteBall, this.whiteBallOptions);
            const target = aim === 'جيب الزاوية' ? 'جيب الزاوية' : parseFloat(aim);
            
            // البحث بشكل آمن
            if (this.tableData && this.tableData[closestWhiteBall] && 
                this.tableData[closestWhiteBall][target]) {
                return this.tableData[closestWhiteBall][target];
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ خطأ في getMeasurements:', error);
            return null;
        }
    }
    
    findClosest(value, array) {
        if (!array || array.length === 0) {
            console.warn('⚠️ Array فارغ أو غير موجود، يتم إرجاع القيمة نفسها');
            return value;
        }
        
        return array.reduce((prev, curr) => {
            return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
        });
    }
    
    // ==================== SAFE UPDATE ====================
    updateCell(whiteBall, aim, field, value) {
        try {
            // التحقق الأساسي
            if (!this.tableData) this.tableData = {};
            if (!this.tableData[whiteBall]) this.tableData[whiteBall] = {};
            if (!this.tableData[whiteBall][aim]) this.tableData[whiteBall][aim] = {};
            
            // تحويل القيم المنطقي
            let cleanValue = value;
            if (field === 'cue' || field === 'path') {
                cleanValue = parseFloat(value);
                if (isNaN(cleanValue)) cleanValue = 0;
            }
            
            this.tableData[whiteBall][aim][field] = cleanValue;
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في updateCell:', error);
            return false;
        }
    }
}

// ==================== SYSTEMS IMPLEMENTATION ====================
class OneRailSystem extends BaseRailSystem {
    constructor() {
        super('OneRail');
    }
}

class TwoRailsSystem extends BaseRailSystem {
    constructor() {
        super('TwoRails');
    }
}

class ThreeRailsSystem extends BaseRailSystem {
    constructor() {
        super('ThreeRails');
        this.whiteBallOptions = [
            0, 0.3, 0.5, 0.7, 0.9, 1, 1.1, 1.25, 1.4, 1.5, 1.6, 1.75, 1.9,
            2, 2.1, 2.25, 2.4, 2.5, 2.6, 2.75, 2.9, 3, 3.1, 3.4, 3.5
        ];
        this.aimOptions = [4, 5, 5.5, 6, 7, 8, 'جيب الزاوية'];
        
        this.initializeDefaults();
        this.safeLoadFromStorage();
    }
    
    initializeDefaults() {
        // البيانات الافتراضية فقط إذا كان الجدول فارغاً
        if (Object.keys(this.tableData).length === 0) {
            this.tableData = {
                0: {
                    4: { cue: 1.5, path: 1.7 },
                    5: { cue: 2.5, path: 2.1, note: '-' },
                    5.5: { cue: 2.2, path: 2.2, note: '-' },
                    6: { cue: 2.7, path: 2.6 },
                    7: { cue: 3.8, path: 3.2 },
                    8: { cue: 4.6, path: 3.7 },
                    'جيب الزاوية': { cue: 4.8, path: 3.8 }
                },
                0.3: {
                    4: { cue: 1.6, path: 1.6 },
                    5: { cue: 2.1, path: 2.2, note: '-' },
                    5.5: { cue: 2.4, path: 2.2, note: '-' },
                    6: { cue: 2.9, path: 2.5 },
                    7: { cue: 4.7, path: 3.7, note: '-' }
                }
            };
        }
    }
}

class FourRailsSystem extends BaseRailSystem {
    constructor() {
        super('FourRails');
    }
}

// ==================== EXPORT ====================
window.OneRailSystem = OneRailSystem;
window.TwoRailsSystem = TwoRailsSystem;
window.ThreeRailsSystem = ThreeRailsSystem;
window.FourRailsSystem = FourRailsSystem;
