// 📁 backup-manager.js
class BackupManager {
    constructor() {
        this.backupKey = '5a_backup_v';
        this.maxBackups = 10;
        this.backupSchedule = 24 * 60 * 60 * 1000; // مرة في اليوم
        this.startAutoBackup();
    }
    
    // نسخ احتياطي تلقائي
    startAutoBackup() {
        // فحص آخ
