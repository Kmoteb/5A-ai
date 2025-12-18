// 📁 rail-systems.js
// أنظمة الجدران المختلفة (1 و 2 و 3 و 4 جدران)

// ==================== ONE RAIL SYSTEM ====================
class OneRailSystem {
    constructor() {
        this.name = 'نظام جدار واحد';
        this.oneRailTable = this.initializeTable();
    }
    
    initializeTable() {
        const table = {};
        for (let wb = 1.25; wb <= 8; wb += 0.25) {
            table[wb] = {};
            for (let aim = 1; aim <= 12; aim++) {
                table[wb][aim] = {
                    cue: '5-7',
                    path: '2-3',
                    note: 'ضربة مباشرة'
                };
            }
        }
        return table;
    }
    
    updateCell(whiteBall, aim, type, value) {
        if (!this.oneRailTable[whiteBall]) return false;
        if (!this.oneRailTable[whiteBall][aim]) return false;
        this.oneRailTable[whiteBall][aim][type] = value;
        return true;
    }
}

// ==================== TWO RAILS SYSTEM ====================
class TwoRailsSystem {
    constructor() {
        this.name = 'نظام جدارين';
        this.twoRailsTable = this.initializeTable();
    }
    
    initializeTable() {
        const table = {};
        for (let wb = 1.25; wb <= 8; wb += 0.25) {
            table[wb] = {};
            for (let aim = 1; aim <= 12; aim++) {
                table[wb][aim] = {
                    cue: '6-8',
                    path: '3-4',
                    note: 'جدار أول ثم جدار ثاني'
                };
            }
        }
        return table;
    }
    
    updateCell(whiteBall, aim, type, value) {
        if (!this.twoRailsTable[whiteBall]) return false;
        if (!this.twoRailsTable[whiteBall][aim]) return false;
        this.twoRailsTable[whiteBall][aim][type] = value;
        return true;
    }
}

// ==================== THREE RAILS SYSTEM ====================
class ThreeRailsSystem {
    constructor() {
        this.name = 'نظام ثلاثة جدران';
        this.threeRailsTable = this.initializeTable();
    }
    
    initializeTable() {
        const table = {};
        for (let wb = 1.25; wb <= 8; wb += 0.25) {
            table[wb] = {};
            for (let aim = 1; aim <= 12; aim++) {
                table[wb][aim] = {
                    cue: '7-9',
                    path: '4-5',
                    note: 'ثلاثة جدران متتالية'
                };
            }
        }
        return table;
    }
    
    updateCell(whiteBall, aim, type, value) {
        if (!this.threeRailsTable[whiteBall]) return false;
        if (!this.threeRailsTable[whiteBall][aim]) return false;
        this.threeRailsTable[whiteBall][aim][type] = value;
        return true;
    }
}

// ==================== FOUR RAILS SYSTEM ====================
class FourRailsSystem {
    constructor() {
        this.name = 'نظام أربعة جدران';
        this.fourRailsTable = this.initializeTable();
    }
    
    initializeTable() {
        const table = {};
        for (let wb = 1.25; wb <= 8; wb += 0.25) {
            table[wb] = {};
            for (let aim = 1; aim <= 12; aim++) {
                table[wb][aim] = {
                    cue: '8-10',
                    path: '5-6',
                    note: 'أربعة جدران معقدة'
                };
            }
        }
        return table;
    }
    
    updateCell(whiteBall, aim, type, value) {
        if (!this.fourRailsTable[whiteBall]) return false;
        if (!this.fourRailsTable[whiteBall][aim]) return false;
        this.fourRailsTable[whiteBall][aim][type] = value;
        return true;
    }
}

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OneRailSystem, TwoRailsSystem, ThreeRailsSystem, FourRailsSystem };
}
