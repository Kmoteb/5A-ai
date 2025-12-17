// 📁 table-state-manager.js
class TableStateManager {
    constructor(tableName) {
        this.tableName = tableName;
        this.history = []; // Undo stack
        this.future = [];  // Redo stack
        this.currentState = null;
        this.transactionBuffer = [];
        this.isRecording = false;
        
        // Initialize with current table
        this.snapshot();
    }
    
    // Begin transaction
    beginTransaction() {
        this.isRecording = true;
        this.transactionBuffer = [];
        return this;
    }
    
    // Record operation
    recordOperation(type, payload) {
        if (!this.isRecording) return;
        
        this.transactionBuffer.push({
            type,
            payload: JSON.parse(JSON.stringify(payload)), // Deep clone
            timestamp: Date.now(),
            userId: this.getCurrentUserId()
        });
    }
    
    // Commit transaction
    commit() {
        if (this.transactionBuffer.length === 0) {
            this.isRecording = false;
            return;
        }
        
        // Save to history
        this.history.push({
            operations: [...this.transactionBuffer],
            snapshot: JSON.parse(JSON.stringify(this.currentState))
        });
        
        // Clear future (invalidate redo)
        this.future = [];
        
        // Apply to current state
        this.applyTransaction(this.transactionBuffer);
        
        // Clean up
        this.transactionBuffer = [];
        this.isRecording = false;
        
        // Limit history size (keep last 50)
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }
    
    // Apply transaction to state
    applyTransaction(operations) {
        operations.forEach(op => {
            switch (op.type) {
                case 'UPDATE_CELL':
                    const { whiteBall, aim, field, value } = op.payload;
                    if (!this.currentState[whiteBall]) this.currentState[whiteBall] = {};
                    if (!this.currentState[whiteBall][aim]) this.currentState[whiteBall][aim] = {};
                    this.currentState[whiteBall][aim][field] = value;
                    break;
                    
                case 'DELETE_ROW':
                    delete this.currentState[op.payload.whiteBall];
                    break;
                    
                case 'DELETE_COLUMN':
                    Object.keys(this.currentState).forEach(wb => {
                        delete this.currentState[wb][op.payload.aim];
                    });
                    break;
                    
                case 'INSERT_ROW':
                    this.currentState[op.payload.whiteBall] = {};
                    break;
                    
                case 'INSERT_COLUMN':
                    Object.keys(this.currentState).forEach(wb => {
                        this.currentState[wb][op.payload.aim] = { cue: '', path: '', note: '' };
                    });
                    break;
            }
        });
    }
    
    // Undo
    undo() {
        if (this.history.length === 0) return false;
        
        const lastTransaction = this.history.pop();
        this.future.push({
            operations: lastTransaction.operations,
            snapshot: JSON.parse(JSON.stringify(this.currentState))
        });
        
        // Restore previous snapshot
        this.currentState = lastTransaction.snapshot;
        return true;
    }
    
    // Redo
    redo() {
        if (this.future.length === 0) return false;
        
        const nextTransaction = this.future.pop();
        this.history.push({
            operations: nextTransaction.operations,
            snapshot: JSON.parse(JSON.stringify(this.currentState))
        });
        
        // Apply the transaction
        this.applyTransaction(nextTransaction.operations);
        return true;
    }
    
    // Get current state
    getState() {
        return this.currentState;
    }
    
    // Set state
    setState(newState) {
        this.currentState = JSON.parse(JSON.stringify(newState));
        this.snapshot();
    }
    
    // Create snapshot
    snapshot() {
        const tableData = this.getTableData();
        this.currentState = JSON.parse(JSON.stringify(tableData));
    }
    
    // Audit trail
    getAuditTrail(limit = 100) {
        return this.history
            .slice(-limit)
            .map(transaction => ({
                timestamp: transaction.operations[0]?.timestamp,
                userId: transaction.operations[0]?.userId,
                operations: transaction.operations.length,
                preview: this.operationPreview(transaction.operations[0])
            }));
    }
    
    operationPreview(op) {
        switch (op.type) {
            case 'UPDATE_CELL':
                return `تعديل ${op.payload.field} → ${op.payload.value}`;
            case 'DELETE_ROW':
                return `حذف صف ${op.payload.whiteBall}`;
            case 'DELETE_COLUMN':
                return `حذف عمود ${op.payload.aim}`;
            default:
                return op.type;
        }
    }
    
    // Clean up
    cleanup() {
        this.history = [];
        this.future = [];
        this.transactionBuffer = [];
    }
}
