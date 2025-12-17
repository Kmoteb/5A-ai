// 📁 cloud-sync-manager.js
class CloudSyncManager {
    constructor() {
        this.dbName = 'FiveADatabase';
        this.dbVersion = 1;
        this.db = null;
        this.syncEndpoint = 'https://api.5a-ai.com/sync';
        this.encryptionKey = this.getEncryptionKey();
    }
    
    // IndexedDB مع encryption
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for shots
                const shotsStore = db.createObjectStore('shots', { keyPath: 'id' });
                shotsStore.createIndex('timestamp', 'timestamp', { unique: false });
                shotsStore.createIndex('rails', 'rails', { unique: false });
                
                // Store for AI model
                db.createObjectStore('ai_model', { keyPath: 'version' });
                
                // Store for sync queue
                db.createObjectStore('sync_queue', { autoIncrement: true });
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    
    // حفظ ضربة مع encryption
    async saveShot(shotData) {
        const encrypted = await this.encrypt(shotData);
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['shots', 'sync_queue'], 'readwrite');
            const shotsStore = transaction.objectStore('shots');
            const syncQueue = transaction.objectStore('sync_queue');
            
            // إضافة للـ queue للمزامنة
            syncQueue.add({
                type: 'SAVE_SHOT',
                data: encrypted,
                timestamp: Date.now(),
                retries: 0
            });
            
            // حفظ محلي
            const request = shotsStore.put(encrypted);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
    
    // مزامنة ذكية مع الخادم
    async sync() {
        if (!this.db || !navigator.onLine) return;
        
        const transaction = this.db.transaction(['sync_queue'], 'readonly');
        const queue = transaction.objectStore('sync_queue');
        const allTasks = await this.getAllFromStore(queue);
        
        for (const task of allTasks) {
            try {
                await this.syncTask(task);
                // حذف من الـ queue عند النجاح
                await this.removeFromQueue(task.id);
            } catch (error) {
                await this.handleSyncError(task, error);
            }
        }
    }
    
    async syncTask(task) {
        const response = await fetch(`${this.syncEndpoint}/${task.type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({
                data: task.data,
                deviceId: this.getDeviceId(),
                timestamp: task.timestamp
            })
        });
        
        if (!response.ok) {
            throw new Error(`Sync failed: ${response.status}`);
        }
        
        return response.json();
    }
    
    async handleSyncError(task, error) {
        const transaction = this.db.transaction(['sync_queue'], 'readwrite');
        const queue = transaction.objectStore('sync_queue');
        
        if (task.retries < 3) {
            // إعادة المحاولة
            task.retries++;
            task.lastError = error.message;
            queue.put(task);
        } else {
            // نقل لـ dead letter queue
            const dlq = transaction.objectStore('dead_letter_queue');
            dlq.add(task);
            queue.delete(task.id);
        }
    }
    
    // Encryption باستخدام Web Crypto API
    async encrypt(data) {
        const key = await this.getCryptoKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        
        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );
        
        return {
            encrypted: Array.from(new Uint8Array(ciphertext)),
            iv: Array.from(iv),
            timestamp: Date.now()
        };
    }
    
    async decrypt(encryptedData) {
        const key = await this.getCryptoKey();
        const iv = new Uint8Array(encryptedData.iv);
        const ciphertext = new Uint8Array(encryptedData.encrypted);
        
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );
        
        return JSON.parse(new TextDecoder().decode(decrypted));
    }
    
    async getCryptoKey() {
        const keyData = await this.deriveKey(this.encryptionKey);
        return crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    }
}
