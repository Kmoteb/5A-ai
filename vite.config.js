// vite.config.js
// ⚙️ إعداد أداة البناء Vite

import { defineConfig } from 'vite'

export default defineConfig({
    // اسم المشروع
    define: {
        __APP_NAME__: JSON.stringify('5A AI System'),
        __APP_VERSION__: JSON.stringify('2.0.0'),
        __ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    
    // إعدادات الخادم
    server: {
        port: 5173,
        host: '0.0.0.0',
        open: false,
        strictPort: false,
        // تمكين CORS
        cors: true,
        // إعادة تحميل سريعة عند التغييرات
        middlewareMode: false
    },
    
    // إعدادات الإنتاج (Build)
    build: {
        // مجلد الإخراج
        outDir: 'dist',
        
        // مجلد المصادر
        assetsDir: 'assets',
        
        // حجم قاعدة معلومات المصدر
        sourcemap: 'hidden',
        
        // إعدادات التصغير (Minification)
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: true,
                pure_funcs: ['console.log']
            },
            mangle: true,
            format: {
                comments: false
            }
        },
        
        // تقسيم الأكواد (Code Splitting)
        rollupOptions: {
            output: {
                // دليل الإخراج
                dir: 'dist',
                format: 'es',
                
                // تقسيم الأكواد حسب الحجم
                manualChunks: {
                    // مكتبات خارجية
                    'core': ['./5a-core.js', './5a-ai.js'],
                    
                    // أدوات الأمان
                    'security': ['./security-utils.js'],
                    
                    // إدارة الحالة
                    'state': ['./system5a-state.js'],
                    
                    // إدارة الواجهة
                    'ui': ['./system5a-ui.js'],
                    
                    // إدارة الأحداث
                    'events': ['./system5a-events.js']
                },
                
                // تنسيق الملفات
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            },
            input: {
                main: './index.html'
            }
        },
        
        // حد أقصى لحجم الملف
        chunkSizeWarningLimit: 500,
        
        // تمكين CommonJS
        commonjsOptions: {
            transformMixedEsModules: true
        },
        
        // اختبار البناء
        reportCompressedSize: true,
        emptyOutDir: true,
        copyPublicDir: true
    },
    
    // حل المسارات المخصصة
    resolve: {
        alias: {
            '@core': '/5a-core.js',
            '@ai': '/5a-ai.js',
            '@security': '/security-utils.js',
            '@state': '/system5a-state.js',
            '@ui': '/system5a-ui.js',
            '@events': '/system5a-events.js'
        },
        // امتدادات الملفات المدعومة
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.html']
    },
    
    // إعدادات CSS
    css: {
        preprocessorOptions: {
            // إذا كان لديك ملفات Sass
            scss: {
                // خيارات إضافية
            }
        },
        // نماذج CSS
        modules: {
            localsConvention: 'camelCase'
        },
        // خريطة المصدر
        sourcemap: false,
        // معالج بريفكسر
        postcss: {}
    },
    
    // إعدادات الإخراج القديمة
    legacy: {
        terasertOptions: {
            safari10: true
        }
    },
    
    // إعدادات الأداء
    optimizeDeps: {
        include: [
            '5a-core.js',
            '5a-ai.js',
            'security-utils.js',
            'system5a-state.js',
            'system5a-ui.js',
            'system5a-events.js'
        ],
        exclude: ['vue']
    },
    
    // إعدادات HMR (Hot Module Replacement)
    hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
        timeout: 60000
    }
});
