// 📁 performance-optimizer.js
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            loadTime: 0,
            apiLatency: []
        };
        
        this.optimizations = {
            // Virtual scrolling for large tables
            virtualScroll: {
                enabled: true,
                rowHeight: 50,
                viewportRows: 20
            },
            
            // Web Workers for heavy calculations
            workers: {
                aiWorker: new Worker('ai-worker.js'),
                geometryWorker: new Worker('geometry-worker.js')
            },
            
            // Cache layers
            cache: new MultiTierCache()
        };
        
        this.startMonitoring();
    }
    
    // Virtual scrolling للجداول الكبيرة
    initializeVirtualScroll(container, data, rowRenderer) {
        const totalHeight = data.length * this.optimizations.virtualScroll.rowHeight;
        container.style.height = totalHeight + 'px';
        
        const viewport = container.parentElement;
        const onScroll = () => {
            const scrollTop = viewport.scrollTop;
            const startIndex = Math.floor(scrollTop / this.optimizations.virtualScroll.rowHeight);
            const endIndex = startIndex + this.optimizations.virtualScroll.viewportRows;
            
            const visibleData = data.slice(startIndex, endIndex);
            const fragment = document.createDocumentFragment();
            
            visibleData.forEach((item, index) => {
                const row = rowRenderer(item, startIndex + index);
                row.style.transform = `translateY(${(startIndex + index) * this.optimizations.virtualScroll.rowHeight}px)`;
                fragment.appendChild(row);
            });
            
            container.innerHTML = '';
            container.appendChild(fragment);
        };
        
        viewport.addEventListener('scroll', 
            this.debounce(onScroll, 16) // ~60fps
        );
        onScroll(); // Initial render
    }
    
    // Web Workers for heavy calculations
    offloadToWorker(workerName, data, callback) {
        const worker = this.optimizations.workers[workerName];
        if (!worker) {
            console.error(`Worker ${workerName} not found`);
            return;
        }
        
        const messageId = Math.random().toString(36);
        
        worker.postMessage({
            id: messageId,
            data: data,
            timestamp: Date.now()
        });
        
        const handler = (event) => {
            if (event.data.id === messageId) {
                callback(event.data.result);
                worker.removeEventListener('message', handler);
            }
        };
        
        worker.addEventListener('message', handler);
    }
    
    // Multi-tier caching (Memory → IndexedDB → localStorage)
    class MultiTierCache {
        constructor() {
            this.memoryCache = new Map();
            this.memoryLimit = 100 * 1024 * 1024; // 100MB
            this.currentMemory = 0;
        }
        
        async get(key) {
            // Tier 1: Memory
            if (this.memoryCache.has(key)) {
                return this.memoryCache.get(key);
            }
            
            // Tier 2: IndexedDB
            const dbResult = await this.getFromIndexedDB(key);
            if (dbResult) {
                this.setInMemory(key, dbResult);
                return dbResult;
            }
            
            // Tier 3: localStorage (fallback)
            const lsResult = localStorage.getItem(key);
            if (lsResult) {
                const parsed = JSON.parse(lsResult);
                this.setInMemory(key, parsed);
                return parsed;
            }
            
            return null;
        }
        
        async set(key, value, options = {}) {
            const size = JSON.stringify(value).length;
            
            // Memory tier
            this.setInMemory(key, value, size);
            
            // IndexedDB tier (async)
            if (!options.skipIndexedDB) {
                this.setInIndexedDB(key, value);
            }
            
            // localStorage tier (for critical data)
            if (options.critical) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    }
    
    // Debounce and throttle
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance monitoring
    startMonitoring() {
        // FPS monitoring
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = (currentTime) => {
            frames++;
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round(frames * 1000 / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measureFPS);
        };
        requestAnimationFrame(measureFPS);
        
        // Memory monitoring
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }
        }, 5000);
        
        // API latency tracking
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const start = performance.now();
            return originalFetch.apply(window, args).then(response => {
                const latency = performance.now() - start;
                this.metrics.apiLatency.push(latency);
                if (this.metrics.apiLatency.length > 100) {
                    this.metrics.apiLatency.shift();
                }
                return response;
            });
        };
    }
    
    // إحصائيات الأداء
    getPerformanceReport() {
        return {
            fps: this.metrics.fps,
            memoryUsage: this.metrics.memory,
            avgApiLatency: this.metrics.apiLatency.reduce((a, b) => a + b, 0) / 
                          (this.metrics.apiLatency.length || 1),
            cacheHitRate: this.optimizations.cache.getHitRate(),
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
    }
}
