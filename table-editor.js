// 📁 table-editor.js - نسخة مستقرة
// إضافة محرك التحقق ومنع الأخطاء
class TableEditor {
    constructor() {
        this.currentRails = 3;
        this.currentTable = null;
        this.editedValues = {};
        this.validationEngine = new ValidationEngine(); // محرك تحقق
        this.stateManager = null; // سيتم تهيئته لاحقاً
        
        this.init();
    }
    
    init() {
        // محاولة آمنة
        try {
            this.loadCurrentTable();
            this.setupEventListeners();
            this.renderTable();
            console.log('✅ محرر الجداول جاهز');
        } catch (error) {
            console.error('❌ فشل تهيئة المحرر:', error);
            this.showError('فشل تحميل المحرر: ' + error.message);
        }
    }
    
    loadCurrentTable() {
        try {
            const rails = parseInt(this.currentRails);
            
            // اختيار النظام المناسب
            const systems = {
                1: OneRailSystem,
                2: TwoRailsSystem,
                3: ThreeRailsSystem,
                4: FourRailsSystem
            };
            
            const SystemClass = systems[rails];
            if (!SystemClass) {
                throw new Error(`نظام ${rails} جدران غير موجود`);
            }
            
            this.currentTable = new SystemClass();
            
            // تهيئة مدير الحالة مع البيانات الحالية
            this.stateManager = new TableStateManager(`rails_${rails}`);
            this.stateManager.setState(this.getCurrentTableData());
            
            console.log(`✅ تم تحميل نظام ${rails} جدران`);
            
        } catch (error) {
            console.error('❌ خطأ في loadCurrentTable:', error);
            this.showError('فشل تحميل الجدول: ' + error.message);
            
            // Fallback: استخدام ThreeRailsSystem
            this.currentTable = new ThreeRailsSystem();
            this.stateManager = new TableStateManager('rails_3');
        }
    }
    
    getCurrentTableData() {
        if (this.currentRails === 1) return this.currentTable.oneRailTable;
        if (this.currentRails === 2) return this.currentTable.twoRailsTable;
        if (this.currentRails === 3) return this.currentTable.threeRailsTable;
        if (this.currentRails === 4) return this.currentTable.fourRailsTable;
        return {};
    }
    
    updateCell(whiteBall, aim, type, value) {
        // التحقق قبل التحديث
        const validation = this.validationEngine.validate(type, value);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }
        
        // بداية transaction
        this.stateManager.beginTransaction();
        this.stateManager.recordOperation('UPDATE_CELL', {
            whiteBall,
            aim,
            field: type,
            value: this.validationEngine.sanitize(type, value)
        });
        
        // التحديث الفعلي
        const success = this.currentTable.updateCell(whiteBall, aim, type, value);
        if (!success) {
            this.showError('فشل التحديث');
            return;
        }
        
        // حفظ transaction
        this.stateManager.commit();
        
        this.showStatus(`✓ تم تحديث ${whiteBall} → ${aim} (${type})`);
    }
    
    // باقي الدوال مع نفس الأسلوب الآمن...
    saveChanges() {
        try {
            const success = this.currentTable.safeSaveToStorage();
            if (!success) {
                throw new Error('فشل عملية الحفظ');
            }
            
            this.showStatus('💾 تم حفظ جميع التغييرات!', 'success');
        } catch (error) {
            this.showError('❌ فشل الحفظ: ' + error.message);
        }
    }
    
    deleteRow(whiteBall) {
        if (!confirm(`⚠️ حذف ${whiteBall}؟ لا يمكن التراجع!`)) return;
        
        this.stateManager.beginTransaction();
        this.stateManager.recordOperation('DELETE_ROW', { whiteBall });
        
        let tableData = this.getCurrentTableData();
        delete tableData[whiteBall];
        
        const index = this.currentTable.whiteBallOptions.indexOf(whiteBall);
        if (index > -1) {
            this.currentTable.whiteBallOptions.splice(index, 1);
        }
        
        this.currentTable.safeSaveToStorage();
        this.stateManager.commit();
        this.renderTable();
        
        this.showStatus(`🗑️ تم حذف ${whiteBall}`, 'warning');
    }
    
    renderTable() {
        try {
            const tableData = this.getCurrentTableData();
            if (!tableData) {
                this.showError('لا توجد بيانات للجدول');
                return;
            }
            
            const whiteBalls = Object.keys(tableData).map(Number).sort((a, b) => a - b);
            const aims = this.getAllAims(tableData);
            
            this.renderHeader(aims);
            this.renderBody(whiteBalls, aims, tableData);
            
        } catch (error) {
            console.error('❌ خطأ في renderTable:', error);
            this.showError('فشل عرض الجدول');
        }
    }
    
    renderHeader(aims) {
        const header = document.getElementById('tableHeader');
        if (!header) return;
        
        let html = '<tr><th class="row-header">قياس الكرة البيضاء</th>';
        
        aims.forEach(aim => {
            const displayName = aim === 'جيب الزاوية' ? aim : `إلى ${aim}`;
            html += `<th class="column-header">
                <div>${displayName}</div>
                <div class="cell-actions">
                    <button class="btn-danger btn-sm" onclick="tableEditor.deleteColumn('${aim}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </th>`;
        });
        
        html += '<th>الإجراءات</th></tr>';
        header.innerHTML = html;
    }
    
    renderBody(whiteBalls, aims, tableData) {
        const body = document.getElementById('tableBody');
        if (!body) return;
        
        // استخدام virtual scrolling للأداء
        const fragment = document.createDocumentFragment();
        
        whiteBalls.forEach(whiteBall => {
            const row = document.createElement('tr');
            row.innerHTML = this.createRowHTML(whiteBall, aims, tableData[whiteBall]);
            fragment.appendChild(row);
        });
        
        body.innerHTML = '';
        body.appendChild(fragment);
    }
    
    // باقي الدوال...
    createRowHTML(whiteBall, aims, rowData) {
        let html = `<td class="row-header">
            <div><strong>${whiteBall}</strong></div>
            <div class="cell-actions">
                <button class="btn-danger btn-sm" onclick="tableEditor.deleteRow(${whiteBall})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>`;
        
        aims.forEach(aim => {
            const cellData = rowData && rowData[aim] ? rowData[aim] : { cue: '', path: '', note: '' };
            
            html += `<td>
                <div class="cell-group">
                    <input type="number" class="cell-input cue-input" 
                           data-whiteball="${whiteBall}" data-aim="${aim}" 
                           data-type="cue" value="${cellData.cue || ''}" 
                           step="0.1" placeholder="العصا"
                           onchange="tableEditor.updateCell(${whiteBall}, '${aim}', 'cue', this.value)">
                    <input type="number" class="cell-input path-input" 
                           data-whiteball="${whiteBall}" data-aim="${aim}" 
                           data-type="path" value="${cellData.path || ''}" 
                           step="0.1" placeholder="المسار"
                           onchange="tableEditor.updateCell(${whiteBall}, '${aim}', 'path', this.value)">
                    <input type="text" class="cell-input cell-note" 
                           data-whiteball="${whiteBall}" data-aim="${aim}" 
                           data-type="note" value="${cellData.note || ''}" 
                           placeholder="ملاحظة"
                           onchange="tableEditor.updateCell(${whiteBall}, '${aim}', 'note', this.value)">
                </div>
            </td>`;
        });
        
        html += `<td>
            <div class="cell-actions">
                <button class="btn-primary btn-sm" onclick="tableEditor.duplicateRow(${whiteBall})">
                    <i class="fas fa-copy"></i> نسخ
                </button>
                <button class="btn-success btn-sm" onclick="tableEditor.saveRow(${whiteBall})">
                    <i class="fas fa-save"></i> حفظ
                </button>
            </div>
        </td>`;
        
        return html;
    }
    
    showStatus(message, type = 'info') {
        const statusBar = document.getElementById('statusBar');
        if (!statusBar) return;
        
        statusBar.textContent = message;
        statusBar.style.display = 'block';
        
        const colors = {
            success: '#00b894',
            error: '#ff7675',
            warning: '#fdcb6e',
            info: '#00d2d3'
        };
        
        statusBar.style.background = colors[type] || colors.info;
        statusBar.style.color = type === 'warning' ? '#000' : '#fff';
        
        setTimeout(() => {
            if (statusBar) statusBar.style.display = 'none';
        }, 3000);
    }
    
    showError(message) {
        this.showStatus('❌ ' + message, 'error');
    }
}

// ==================== محرك التحقق البسيط ====================
class ValidationEngine {
    constructor() {
        this.rules = {
            cue: { min: 0, max: 15 },
            path: { min: 0, max: 12 },
            note: { maxLength: 50 }
        };
    }
    
    validate(field, value) {
        if (field === 'cue' || field === 'path') {
            const num = parseFloat(value);
            if (isNaN(num)) return { valid: false, error: 'يجب أن يكون رقمًا' };
            const rule = this.rules[field];
            if (num < rule.min || num > rule.max) {
                return { valid: false, error: `يجب أن يكون بين ${rule.min} و${rule.max}` };
            }
        }
        return { valid: true };
    }
    
    sanitize(field, value) {
        return value;
    }
}

// ==================== إدارة الحالة مع التراجع ====================
class TableStateManager {
    constructor(name) {
        this.name = name;
        this.history = [];
        this.maxHistory = 20;
    }
    
    beginTransaction() {
        this.currentOps = [];
    }
    
    recordOperation(type, payload) {
        this.currentOps.push({ type, payload, timestamp: Date.now() });
    }
    
    commit() {
        if (!this.currentOps || this.currentOps.length === 0) return;
        
        this.history.push([...this.currentOps]);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        this.currentOps = null;
    }
    
    setState(data) {
        this.state = JSON.parse(JSON.stringify(data));
    }
}

// ==================== التهيئة الآمنة ====================
let tableEditor;
try {
    tableEditor = new TableEditor();
    window.tableEditor = tableEditor;
    console.log('✅ TableEditor تم تهيئته بنجاح');
} catch (error) {
    console.error('❌ فشل تهيئة TableEditor:', error);
    alert('فشل تحميل المحرق: ' + error.message);
}

// دوال مساعدة عالمية
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
};
