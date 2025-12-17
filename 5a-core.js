// 📁 5a-core.js
// نظام التحكم وربط الواجهة - 5A System

const System5A = {
    // حالة التطبيق
    state: {
        currentShot: {
            rails: 3,
            whiteBallMeasurement: 1.25,
            aimMeasurement: 7,
            cueMeasurement: null,
            pathMeasurement: null,
            notes: ''
        },
        library: []
    },

    // التهيئة
    init: function() {
        this.loadLibrary();
        this.setupEventListeners();
        this.updateUIStats();
        console.log('🚀 نظام 5A جاهز للعمل');
    },

    // إعداد مستمعي الأحداث
    setupEventListeners: function() {
        // التنقل بين التبويبات
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.dataset.tab + 'Tab';
                
                // تحديث الأزرار
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // تحديث المحتوى
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                if (document.getElementById(targetId)) {
                    document.getElementById(targetId).classList.add('active');
                }
            });
        });

        // البحث في المكتبة
        document.getElementById('librarySearch')?.addEventListener('input', (e) => {
            this.filterLibrary(e.target.value);
        });

        // تصفية المكتبة
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                this.filterLibraryByRails(filter);
            });
        });

        // زر التصدير
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportUserData());

        // أزرار بدء التدريب
        document.querySelectorAll('.btn-start-drill').forEach(btn => {
            btn.addEventListener('click', () => {
                const drillId = btn.parentElement.dataset.drill;
                this.startDrill(drillId);
            });
        });

        // زر إدارة الجداول
        document.getElementById('tableEditorBtn')?.addEventListener('click', () => {
            window.open('table-editor.html', '_blank');
        });
    },

    // تحليل الضربة الحالية
    analyzeCurrentShot: function() {
        // هذه الدالة سيتم استبدالها بنظام القياسات الجديد
        const resultsDiv = document.getElementById('analysisResults');
        if (!resultsDiv) return;
        
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>جاري تحليل الضربة...</div>';

        // استخدام نظام 5A AI
        setTimeout(() => {
            if (window.FiveAAI) {
                const analysis = window.FiveAAI.analyzeShot(this.state.currentShot);
                this.renderAnalysisResults(analysis);
                
                // تحديث رسالة المساعد
                const aiMessage = document.getElementById('aiWelcomeMessage');
                if (aiMessage) {
                    aiMessage.textContent = `تم تحليل ضربتك! نسبة النجاح المتوقعة: ${analysis.successPrediction}%`;
                }
            } else {
                resultsDiv.innerHTML = '<div class="error">❌ نظام الذكاء الاصطناعي غير متاح</div>';
            }
        }, 1000);
    },

    // عرض نتائج التحليل
    renderAnalysisResults: function(analysis) {
        const resultsDiv = document.getElementById('analysisResults');
        if (!resultsDiv) return;
        
        let html = `
            <div class="result-header">
                <h3><i class="fas fa-microchip"></i> نتائج تحليل 5A</h3>
                <span class="confidence-badge">الثقة: ${analysis.aiConfidence}%</span>
            </div>
            
            <div class="prediction-card ${analysis.successPrediction > 70 ? 'high-chance' : 'low-chance'}">
                <div class="prediction-circle">
                    <span>${analysis.successPrediction}%</span>
                    <small>نسبة النجاح</small>
                </div>
                <div class="prediction-info">
                    <h4>${analysis.difficulty?.level || 'متوسط'}</h4>
                    <p>مستوى المخاطرة: ${analysis.riskLevel?.warning || 'متوسطة'}</p>
                    <p>الصعوبة: ${analysis.difficulty?.score || 5}/10</p>
                </div>
            </div>
        `;

        // إضافة التوصيات إذا كانت موجودة
        if (analysis.recommendations && analysis.recommendations.length > 0) {
            html += `
                <div class="recommendations-list">
                    <h4><i class="fas fa-star"></i> التوصيات الذكية:</h4>
                    ${analysis.recommendations.slice(0, 3).map(rec => `
                        <div class="rec-item ${rec.priority || 'medium'}">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <strong>${rec.text || ''}</strong>
                                ${rec.tips && rec.tips[0] ? `<small>${rec.tips[0]}</small>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        resultsDiv.innerHTML = html;
    },

    // حفظ الضربة
    saveCurrentShot: function() {
        // هذه الدالة سيتم استبدالها بنظام القياسات الجديد
        // التحقق من البيانات الأساسية
        if (!this.state.currentShot.cueMeasurement) {
            this.showNotification('يرجى تحليل الضربة أولاً', 'error');
            return;
        }

        if (window.FiveAAI) {
            // إضافة التحليل للبيانات
            const analysis = window.FiveAAI.analyzeShot(this.state.currentShot);
            const shotToSave = {
                ...this.state.currentShot,
                analysis: analysis,
                id: Date.now(),
                date: new Date().toISOString()
            };

            this.state.library.unshift(shotToSave);
            this.saveToStorage();
            this.renderLibrary();
            this.updateUIStats();

            this.showNotification('تم حفظ الضربة بنجاح!', 'success');
        } else {
            this.showNotification('نظام الذكاء الاصطناعي غير متاح', 'error');
        }
    },

    // إدارة التخزين
    saveToStorage: function() {
        localStorage.setItem('5a_shots_library', JSON.stringify(this.state.library));
    },

    loadLibrary: function() {
        const saved = localStorage.getItem('5a_shots_library');
        if (saved) {
            this.state.library = JSON.parse(saved);
            this.renderLibrary();
        }
    },

    // عرض المكتبة
    renderLibrary: function() {
        const listContainer = document.getElementById('shotsList');
        if (!listContainer) return;

        if (this.state.library.length === 0) {
            listContainer.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px; color: var(--gray);"><i class="fas fa-inbox fa-3x"></i><p>لا توجد ضربات محفوظة بعد</p></div>';
            return;
        }

        listContainer.innerHTML = this.state.library.slice(0, 20).map(shot => `
            <div class="shot-card" data-id="${shot.id}">
                <div class="shot-info">
                    <span class="shot-date">${new Date(shot.date).toLocaleDateString('ar-EG')}</span>
                    <h4>${shot.rails || 0} جدران | قوة ${shot.cueMeasurement || 0}</h4>
                    <p>${shot.notes || 'بدون ملاحظات'}</p>
                </div>
                <div class="shot-score">
                    <span class="score-val">${shot.analysis?.successPrediction || 0}%</span>
                </div>
            </div>
        `).join('');
    },

    // تصفية المكتبة
    filterLibrary: function(searchTerm) {
        const filteredShots = this.state.library.filter(shot => {
            const searchLower = searchTerm.toLowerCase();
            return (
                shot.notes?.toLowerCase().includes(searchLower) ||
                shot.rails?.toString().includes(searchTerm) ||
                shot.cueMeasurement?.toString().includes(searchTerm)
            );
        });
        
        this.renderFilteredLibrary(filteredShots);
    },

    filterLibraryByRails: function(rails) {
        if (rails === 'all') {
            this.renderLibrary();
            return;
        }
        
        const filteredShots = this.state.library.filter(shot => shot.rails === parseInt(rails));
        this.renderFilteredLibrary(filteredShots);
    },

    renderFilteredLibrary: function(shots) {
        const listContainer = document.getElementById('shotsList');
        if (!listContainer) return;

        if (shots.length === 0) {
            listContainer.innerHTML = '<div class="empty-state" style="text-align: center; padding: 40px; color: var(--gray);"><p>لا توجد نتائج مطابقة</p></div>';
            return;
        }

        listContainer.innerHTML = shots.slice(0, 20).map(shot => `
            <div class="shot-card" data-id="${shot.id}">
                <div class="shot-info">
                    <span class="shot-date">${new Date(shot.date).toLocaleDateString('ar-EG')}</span>
                    <h4>${shot.rails || 0} جدران | قوة ${shot.cueMeasurement || 0}</h4>
                    <p>${shot.notes || 'بدون ملاحظات'}</p>
                </div>
                <div class="shot-score">
                    <span class="score-val">${shot.analysis?.successPrediction || 0}%</span>
                </div>
            </div>
        `).join('');
    },

    // تحديث الإحصائيات
    updateUIStats: function() {
        const totalShotsElement = document.getElementById('totalShots');
        const totalShotsCountElement = document.getElementById('totalShotsCount');
        const aiAccuracyElement = document.getElementById('aiAccuracy');
        const successRateElement = document.getElementById('successRate');
        const learningLevelElement = document.getElementById('learningLevel');
        const topRailsElement = document.getElementById('topRails');
        
        if (totalShotsElement) totalShotsElement.textContent = this.state.library.length;
        if (totalShotsCountElement) totalShotsCountElement.textContent = this.state.library.length;
        
        // حساب متوسط الدقة
        if (this.state.library.length > 0) {
            const avg = this.state.library.reduce((acc, curr) => acc + (curr.analysis?.successPrediction || 0), 0) / this.state.library.length;
            if (aiAccuracyElement) aiAccuracyElement.textContent = Math.round(avg) + '%';
            if (successRateElement) successRateElement.textContent = Math.round(avg) + '%';
        }
        
        // تحديث مستوى التعلم
        const level = Math.min(10, Math.floor(this.state.library.length / 5) + 1);
        if (learningLevelElement) learningLevelElement.textContent = level;
        
        // تحديث الجدران المفضلة
        const railsCount = {};
        this.state.library.forEach(shot => {
            railsCount[shot.rails] = (railsCount[shot.rails] || 0) + 1;
        });
        
        let topRails = 1;
        let maxCount = 0;
        for (const [rails, count] of Object.entries(railsCount)) {
            if (count > maxCount) {
                maxCount = count;
                topRails = rails;
            }
        }
        
        if (topRailsElement) topRailsElement.textContent = topRails;
    },

    // تصدير البيانات
    exportUserData: function() {
        const dataToExport = {
            system: "5A AI System",
            version: "1.0",
            exportDate: new Date().toISOString(),
            userProfile: {
                level: document.getElementById('learningLevel')?.textContent || "1",
                totalShots: this.state.library.length
            },
            library: this.state.library,
            aiMemory: JSON.parse(localStorage.getItem('5a_ai_model') || '{}'),
            tables: {
                oneRail: JSON.parse(localStorage.getItem('1rail_table') || '{}'),
                twoRails: JSON.parse(localStorage.getItem('2rails_table') || '{}'),
                threeRails: JSON.parse(localStorage.getItem('3rails_table') || '{}'),
                fourRails: JSON.parse(localStorage.getItem('4rails_table') || '{}')
            }
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `5A-Backup-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        // تنظيف
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('تم تصدير بياناتك بنجاح', 'success');
    },

    // بدء التدريب
    startDrill: function(drillId) {
        const drills = {
            'diamond-mastery': {
                name: 'إتقان نظام الدايمند',
                description: '10 ضربات بكل قيمة من قيم الدايمند',
                steps: [
                    'ابدأ بقيمة 0.5 واضرب 10 كرات',
                    'انتقل إلى قيمة 1.0 واضرب 10 كرات',
                    'استمر حتى تصل إلى قيمة 4.5'
                ]
            },
            'rail-control': {
                name: 'السيطرة على الجدران',
                description: '5 ضربات بكل عدد من الجدران',
                steps: [
                    '5 ضربات بجدار واحد',
                    '5 ضربات بجدارين',
                    '5 ضربات بثلاثة جدرات',
                    '5 ضربات بأربعة جدرات'
                ]
            },
            'pressure-training': {
                name: 'التدريب تحت الضغط',
                description: 'ضربات متتالية بوقت محدود',
                steps: [
                    'اضرب 20 كرة في دقيقتين',
                    'حاول أن تحقق 70% دقة على الأقل',
                    'كرر التمرين مع تقليل الوقت'
                ]
            }
        };
        
        const drill = drills[drillId];
        if (!drill) return;
        
        this.showNotification(`بدأت تمرين: ${drill.name}`, 'info');
        
        // التبديل إلى تبويب محلل الضربات
        this.switchTab('analyzer');
    },

    // عرض الإشعارات
    showNotification: function(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                               type === 'error' ? 'fa-exclamation-circle' : 
                               'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // إضافة الأنماط
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#00b894' : 
                         type === 'error' ? '#ff7675' : 
                         '#0984e3'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-family: 'Cairo', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // إخفاء بعد 3 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },

    // تبديل التبويبات
    switchTab: function(tabName) {
        // إخفاء جميع التبويبات
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // إلغاء تنشيط جميع أزرار التنقل
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // إظهار التبويب المطلوب
        const targetTab = document.getElementById(`${tabName}Tab`);
        const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');
    }
};

// دمج النظام الجديد للقياسات
if (typeof MeasurementManager !== 'undefined') {
    let measurementManager = null;
    
    // تعديل دالة التحليل لتعمل مع النظام الجديد
    const originalAnalyzeBtn = document.getElementById('analyzeBtn');
    if (originalAnalyzeBtn) {
        originalAnalyzeBtn.addEventListener('click', () => {
            if (measurementManager && typeof measurementManager.analyzeCurrentShot === 'function') {
                measurementManager.analyzeCurrentShot();
            } else {
                System5A.analyzeCurrentShot();
            }
        });
    }
    
    // تعديل دالة الحفظ لتعمل مع النظام الجديد
    const originalSaveBtn = document.getElementById('saveBtn');
    if (originalSaveBtn) {
        originalSaveBtn.addEventListener('click', () => {
            if (measurementManager && typeof measurementManager.saveCurrentShot === 'function') {
                measurementManager.saveCurrentShot();
            } else {
                System5A.saveCurrentShot();
            }
        });
    }
}

// تحديث التهيئة لتشمل النظام الجديد
function initializePlatoApp() {
    System5A.init();
    
    // إضافة أنيميشن للإشعارات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-family: 'Cairo', sans-serif;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification.success {
            background: #00b894;
            color: white;
        }
        
        .notification.error {
            background: #ff7675;
            color: white;
        }
        
        .notification.info {
            background: #0984e3;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    // تشغيل مدير القياسات
    if (typeof MeasurementManager !== 'undefined') {
        setTimeout(() => {
            try {
                measurementManager = new MeasurementManager();
                console.log('✅ تم تحميل مدير القياسات بنجاح');
            } catch (e) {
                console.error('❌ فشل تحميل مدير القياسات:', e);
            }
        }, 500);
    }
}

// 📁 5a-core.js (تحديث)
const System5A = {
    // ... الكود السابق ...
    
    // نظام Buffering وتوقيت دقيق
    performanceOptimizer: {
        // Preload critical resources
        preloadCriticalAssets() {
            const criticalAssets = [
                'advanced-tables.js',
                '5A-ai.js',
                'table-manager.js'
            ];
            
            criticalAssets.forEach(asset => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = asset;
                link.as = 'script';
                document.head.appendChild(link);
            });
        },
        
        // Debounce للإدخالات السريعة
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Memoization للحسابات الثقيلة
        memoize(fn) {
            const cache = new Map();
            return function(...args) {
                const key = JSON.stringify(args);
                if (cache.has(key)) return cache.get(key);
                const result = fn.apply(this, args);
                cache.set(key, result);
                return result;
            };
        }
    },

    // تهيئة مع تحسين الأداء
    initOptimized() {
        // بدء preload في background
        this.performanceOptimizer.preloadCriticalAssets();
        
        // Debounce للأحداث الرئيسية
        const debouncedCalculate = this.performanceOptimizer.debounce(
            () => measurementManager?.calculateResults(), 
            150
        );
        
        // إضافة المستمعين مع تنظيف تلقائي
        this.addCleanEventListener('whiteBallValue', 'change', debouncedCalculate);
        this.addCleanEventListener('aimValue', 'change', debouncedCalculate);
        
        console.log('🚀 نظام 5A محسّن للأداء');
    },
    
    // إضافة مستمع مع تنظيف تلقائي
    addCleanEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // تنظيف المستمع القديم إن وجد
        const oldHandler = element.dataset.handler;
        if (oldHandler) {
            element.removeEventListener(event, oldHandler);
        }
        
        // إضافة المستمع الجديد
        element.addEventListener(event, handler);
        element.dataset.handler = handler;
    }
};

// Batch operations
batchSaveShots(shotsArray) {
    return this.optimizationQueue.add('batchSave', async () => {
        const transaction = this.db.transaction(['shots'], 'readwrite');
        const store = transaction.objectStore('shots');
        
        const promises = shotsArray.map(shot => 
            new Promise((resolve, reject) => {
                const request = store.put(shot);
                request.onsuccess = resolve;
                request.onerror = () => reject(request.error);
            })
        );
        
        await Promise.all(promises);
    });
}

// تحليل متقدم للأنماط
analyzePatterns() {
    const shots = this.state.library;
    
    // Clustering بسيط
    const clusters = this.kMeansClustering(shots, 5);
    
    // تحديد النمط المفضل
    const dominantPattern = clusters.reduce((max, cluster) => 
        cluster.size > max.size ? cluster : max
    );
    
    return {
        clusters,
        dominantPattern,
        outliers: this.detectOutliers(shots),
        trend: this.calculateTrend(shots)
    };
}

kMeansClustering(data, k) {
    // تبسيط لـ k-means
    const centroids = this.initializeCentroids(data, k);
    const clusters = Array(k).fill().map(() => []);
    
    // Iterations
    for (let iter = 0; iter < 10; iter++) {
        clusters.fill().map(() => []);
        
        data.forEach(point => {
            const closest = this.findClosestCentroid(point, centroids);
            clusters[closest].push(point);
        });
        
        this.updateCentroids(centroids, clusters);
    }
    
    return clusters.map((cluster, idx) => ({
        id: idx,
        size: cluster.length,
        centroid: centroids[idx],
        points: cluster
    }));
}


// جعل النظام متاحاً عالمياً
window.System5A = System5A;
window.initializePlatoApp = initializePlatoApp;
// ==================== Performance Optimizer Integration ====================
if (typeof PerformanceOptimizer !== 'undefined') {
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // دمج مع System5A
    System5A.performance = window.performanceOptimizer;
    
    // عرض إحصائيات كل 30 ثانية
    setInterval(() => {
        const stats = performanceOptimizer.getPerformanceReport();
        console.log('📊 Performance Stats:', stats);
    }, 30000);
}
