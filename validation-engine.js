// 📁 validation-engine.js
class ValidationEngine {
    constructor() {
        this.rules = {
            cue: {
                type: 'number',
                min: 0,
                max: 15,
                precision: 1,
                validator: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num)) return 'يجب أن يكون رقمًا';
                    if (num < 0 || num > 15) return 'يجب أن يكون بين 0 و 15';
                    if (num > 0 && num < 1) return 'قليل من 1 يعني أكبر من 10';
                    return null;
                }
            },
            path: {
                type: 'number',
                min: 0,
                max: 12,
                precision: 1,
                validator: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num)) return 'يجب أن يكون رقمًا';
                    if (num < 0 || num > 12) return 'يجب أن يكون بين 0 و 12';
                    return null;
                }
            },
            note: {
                type: 'string',
                maxLength: 50,
                validator: (value) => {
                    if (value.length > 50) return 'الحد الأقصى 50 حرفًا';
                    return null;
                }
            },
            whiteBall: {
                type: 'number',
                min: 0,
                max: 8,
                precision: 1,
                validator: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num)) return 'يجب أن يكون رقمًا';
                    if (num < 0 || num > 8) return 'يجب أن يكون بين 0 و 8';
                    return null;
                }
            },
            aim: {
                type: 'string',
                validator: (value) => {
                    if (value === 'جيب الزاوية') return null;
                    const num = parseFloat(value);
                    if (isNaN(num)) return 'يجب أن يكون رقمًا أو "جيب الزاوية"';
                    if (num < 0 || num > 9) return 'يجب أن يكون بين 0 و 9';
                    return null;
                }
            }
        };
        
        this.errors = new Map();
    }
    
    // Validate single value
    validate(fieldName, value) {
        const rule = this.rules[fieldName];
        if (!rule) return { valid: true };
        
        const error = rule.validator(value);
        if (error) {
            this.errors.set(fieldName, error);
            return { valid: false, error };
        }
        
        this.errors.delete(fieldName);
        return { valid: true };
    }
    
    // Validate entire row
    validateRow(row) {
        const rowErrors = {};
        let isValid = true;
        
        Object.entries(row).forEach(([field, value]) => {
            const result = this.validate(field, value);
            if (!result.valid) {
                rowErrors[field] = result.error;
                isValid = false;
            }
        });
        
        return { valid: isValid, errors: rowErrors };
    }
    
    // Validate table structure
    validateTable(tableData) {
        const tableErrors = [];
        
        Object.entries(tableData).forEach(([whiteBall, aims]) => {
            const wbValidation = this.validate('whiteBall', whiteBall);
            if (!wbValidation.valid) {
                tableErrors.push(`خطأ في صف ${whiteBall}: ${wbValidation.error}`);
            }
            
            Object.entries(aims).forEach(([aim, values]) => {
                const aimValidation = this.validate('aim', aim);
                if (!aimValidation.valid) {
                    tableErrors.push(`خطأ في هدف ${aim}: ${aimValidation.error}`);
                }
                
                const rowValidation = this.validateRow(values);
                if (!rowValidation.valid) {
                    tableErrors.push(`خطأ في البيانات: ${JSON.stringify(rowValidation.errors)}`);
                }
            });
        });
        
        return {
            valid: tableErrors.length === 0,
            errors: tableErrors,
            summary: `تم العثور على ${tableErrors.length} أخطاء`
        };
    }
    
    // Sanitize input
    sanitize(fieldName, value) {
        const rule = this.rules[fieldName];
        if (!rule) return value;
        
        switch (rule.type) {
            case 'number':
                const num = parseFloat(value);
                if (isNaN(num)) return rule.min || 0;
                return Math.max(rule.min, Math.min(rule.max, num));
                
            case 'string':
                return String(value).substring(0, rule.maxLength || 1000);
                
            default:
                return value;
        }
    }
    
    // Get all errors
    getErrors() {
        return Array.from(this.errors.entries());
    }
    
    // Clear errors
    clearErrors() {
        this.errors.clear();
    }
}
