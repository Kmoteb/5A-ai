// 📁 table-manager.js
// مدير النظام الجديد للقياسات

class MeasurementManager {
    constructor() {
        this.railsSystems = {
            1: new OneRailSystem(),
            2: new TwoRailsSystem(),
            3: new ThreeRailsSystem(),
            4: new FourRailsSystem()
        };
        
        this.currentRails = 3;
        this.currentWhiteBall = 1.25;
        this.currentAim = 7;
        
        // إضافة حاسبة الهندسة إن وجدت
        this.geometryCalculator = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateWhiteBallOptions();
        this.calculateResults();
        
        // ✅ إضافة حاسبة المسافات والزوايا
        if (typeof GeometryCalculator !== 'undefined') {
            this.geometryCalculator = new GeometryCalculator();
            console.log('📐 Geometry calculator ready');
        }
        
        console.log('✅ مدير القياسات جاهز');
    }
    
    setupEventListeners() {
        // اختيار عدد الجدران
        document.querySelectorAll('.rail-selector').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rails = parseInt(e.currentTarget.dataset.rails);
                this.switchRailsSystem(rails);
            });
        });
        
        // قياس الكرة البيضاء
        const whiteBallSelect = document.getElementById('whiteBallValue');
        const whiteBallSlider = document.getElementById('whiteBallSlider');
        
        if (whiteBallSelect) {
            whiteBallSelect.addEventListener('change', (e) => {
                this.currentWhiteBall = parseFloat(e.target.value);
                if (whiteBallSlider) whiteBallSlider.value = this.currentWhiteBall;
                this.calculateResults();
            });
        }
        
        if (whiteBallSlider) {
            whiteBallSlider.addEventListener('input', (e) => {
                this.currentWhiteBall = parseFloat(e.target.value);
                if (whiteBallSelect) whiteBallSelect.value = this.currentWhiteBall;
                this.calculateResults();
            });
        }
        
        // القيم السريعة للكرة البيضاء
        document.querySelectorAll('.quick-value').forEach(span => {
            span.addEventListener('click', () => {
                const value = parseFloat(span.dataset.value);
                this.currentWhiteBall = value;
                if (whiteBallSelect) whiteBallSelect.value = value;
                if (whiteBallSlider) whiteBallSlider.value = value;
                this.calculateResults();
            });
        });
        
        // قياس الهدف
        const aimSelect = document.getElementById('aimValue');
        if (aimSelect) {
            aimSelect.addEventListener('change', (e) => {
                this.currentAim = e.target.value;
                this.calculateResults();
            });
        }
    }
    
    switchRailsSystem(rails) {
        if (rails === this.currentRails) return;
        
        // تحديث الواجهة
        document.querySelectorAll('.rail-selector').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.rails) === rails) {
                btn.classList.add('active');
            }
        });
        
        this.currentRails = rails;
        
        // إشعار إذا لم يكن النظام جاهزاً بعد
        const system = this.railsSystems[rails];
        if (!system || system.whiteBallOptions.length === 0) {
            this.showMessage(`نظام ${rails} جدران غير متوفر بعد. سيتم تفعيله قريباً.`, 'info');
            return;
        }
        
        // تحديث خيارات الكرة البيضاء
        this.updateWhiteBallOptions();
        this.calculateResults();
    }
    
    updateWhiteBallOptions() {
        const select = document.getElementById('whiteBallValue');
        if (!select) return;
        
        const system = this.railsSystems[this.currentRails];
        if (!system || !system.whiteBallOptions) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر القياس...</option>';
        
        system.whiteBallOptions.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `${value}`;
            
            // تحديد القيمة الحالية إذا كانت متطابقة
            if (value === this.currentWhiteBall) {
                option.selected = true;
            }
            
            select.appendChild(option);
        });
        
        // إذا كانت القيمة الحالية غير موجودة، اختر الأولى
        if (currentValue && select.value !== currentValue) {
            select.selectedIndex = 1; // أول خيار بعد "اختر..."
            this.currentWhiteBall = parseFloat(select.value);
        }
        
        // تحديث السلايدر
        const slider = document.getElementById('whiteBallSlider');
        if (slider) {
            slider.value = this.currentWhiteBall;
        }
    }
    
    calculateResults() {
        const system = this.railsSystems[this.currentRails];
        
        if (!system || !this.currentWhiteBall || !this.currentAim) {
            this.clearResults();
            return;
        }
        
        const result = system.getMeasurements(this.currentWhiteBall, this.currentAim);
        
        if (result) {
            // عرض النتائج
            this.displayResults(result);
            
            // إخفاء إشعار البيانات المفقودة
            this.hideMissingDataAlert();
            
            // تحديث حالة النظام الرئيسي
            this.updateSystemState(result);
        } else {
            // البيانات غير موجودة
            this.showMissingDataAlert();
            this.clearResults();
        }
    }
    
    displayResults(result) {
        // قياس العصا
        let cueValue = result.cue;
        let cueDisplay = cueValue.toString();
        
        // إذا كان قياس العصا أقل من 1، فهو في الواقع أكثر من 10
        if (cueValue < 1 && cueValue > 0) {
            cueDisplay = `10.${(cueValue * 10).toFixed(0)}`;
        } else if (cueValue === 0) {
            cueDisplay = '10';
        }
        
        document.getElementById('calculatedCue').textContent = cueDisplay;
        
        // قياس المسار
        document.getElementById('calculatedPath').textContent = result.path;
        
        // الملاحظات
        const cueNote = document.getElementById('cueNote');
        const pathNote = document.getElementById('pathNote');
        
        if (result.note) {
            cueNote.textContent = result.note;
            pathNote.textContent = result.note;
        } else {
            cueNote.textContent = '';
            pathNote.textContent = '';
        }
    }
    
    clearResults() {
        document.getElementById('calculatedCue').textContent = '-';
        document.getElementById('calculatedPath').textContent = '-';
        document.getElementById('cueNote').textContent = '';
        document.getElementById('pathNote').textContent = '';
    }
    
    showMissingDataAlert() {
        const alert = document.getElementById('missingDataAlert');
        if (alert) {
            alert.style.display = 'flex';
        }
    }
    
    hideMissingDataAlert() {
        const alert = document.getElementById('missingDataAlert');
        if (alert) {
            alert.style.display = 'none';
        }
    }
    
    updateSystemState(result) {
        if (!window.System5A) return;
        
        // تحويل قياس العصا إذا كان أقل من 1
        let cueValue = result.cue;
        if (cueValue < 1 && cueValue > 0) {
            cueValue = 10 + cueValue;
        } else if (cueValue === 0) {
            cueValue = 10;
        }
        
        window.System5A.state.currentShot = {
            rails: this.currentRails,
            whiteBallMeasurement: this.currentWhiteBall,
            aimMeasurement: this.currentAim,
            cueMeasurement: cueValue,
            pathMeasurement: result.path,
            notes: result.note ? `ملاحظة: ${result.note}` : ''
        };
    }
    
    // دالة لتحليل الضربة بالذكاء الاصطناعي
    analyzeCurrentShot() {
        if (!window.System5A) return;
        
        const system = this.railsSystems[this.currentRails];
        if (!system || !this.currentWhiteBall || !this.currentAim) {
            window.System5A.showNotification('يرجى إدخال جميع القياسات', 'error');
            return;
        }
        
        const result = system.getMeasurements(this.currentWhiteBall, this.currentAim);
        if (!result) {
            window.System5A.showNotification('القياسات غير متوفرة في الجدول', 'error');
            return;
        }
        
        // تحويل قياس العصا
        let cueValue = result.cue;
        if (cueValue < 1 && cueValue > 0) {
            cueValue = 10 + cueValue;
        } else if (cueValue === 0) {
            cueValue = 10;
        }
        
        const shotData = {
            rails: this.currentRails,
            whiteBallMeasurement: this.currentWhiteBall,
            aimMeasurement: this.currentAim,
            cueMeasurement: cueValue,
            pathMeasurement: result.path,
            notes: result.note || ''
        };
        
        // استخدام الذكاء الاصطناعي للتحليل
        if (window.FiveAAI) {
            const analysis = window.FiveAAI.analyzeShot(shotData);
            
            // عرض النتائج في قسم التحليل
            const resultsDiv = document.getElementById('analysisResults');
            if (resultsDiv) {
                resultsDiv.style.display = 'block';
                window.System5A.renderAnalysisResults(analysis);
            }
            
            window.System5A.showNotification('تم تحليل الضربة بنجاح', 'success');
        }
    }
    
    // دالة لحفظ الضربة في المكتبة
    saveCurrentShot() {
        if (!window.System5A) return;
        
        const system = this.railsSystems[this.currentRails];
        if (!system || !this.currentWhiteBall || !this.currentAim) {
            window.System5A.showNotification('يرجى إدخال جميع القياسات', 'error');
            return;
        }
        
        const result = system.getMeasurements(this.currentWhiteBall, this.currentAim);
        if (!result) {
            window.System5A.showNotification('القياسات غير متوفرة في الجدول', 'error');
            return;
        }
        
        // تحويل قياس العصا
        let cueValue = result.cue;
        if (cueValue < 1 && cueValue > 0) {
            cueValue = 10 + cueValue;
        } else if (cueValue === 0) {
            cueValue = 10;
        }
        
        const shotToSave = {
            rails: this.currentRails,
            whiteBallMeasurement: this.currentWhiteBall,
            aimMeasurement: this.currentAim,
            cueMeasurement: cueValue,
            pathMeasurement: result.path,
            note: result.note || '',
            id: Date.now(),
            date: new Date().toISOString()
        };
        
        // تحليل بالذكاء الاصطناعي
        if (window.FiveAAI) {
            const analysis = window.FiveAAI.analyzeShot(shotToSave);
            shotToSave.analysis = analysis;
        }
        
        window.System5A.state.library.unshift(shotToSave);
        window.System5A.saveToStorage();
        window.System5A.renderLibrary();
        window.System5A.updateUIStats();
        
        window.System5A.showNotification('تم حفظ الضربة بنجاح!', 'success');
    }
    
    showMessage(text, type = 'info') {
        // يمكن تطوير هذه الدالة لعرض رسائل جميلة
        console.log(`${type}: ${text}`);
    }
}

// إنشاء نسخة عالمية
window.MeasurementManager = MeasurementManager;
