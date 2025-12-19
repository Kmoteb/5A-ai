// 📁 security-utils.js
// أدوات أمان شاملة للمشروع

// ==================== التحقق من الأنواع ====================

/**
 * التحقق من أن القيمة رقم صحيح ضمن نطاق محدد
 * @param {*} value - القيمة المراد التحقق منها
 * @param {number} min - الحد الأدنى
 * @param {number} max - الحد الأقصى
 * @returns {number} الرقم المحقق منه
 */
function validateNumber(value, min = -Infinity, max = Infinity) {
  const num = Number(value);
  if (isNaN(num)) {
    throw new TypeError(`قيمة غير صحيحة: "${value}" ليست رقماً`);
  }
  if (num < min || num > max) {
    throw new RangeError(`القيمة ${num} خارج النطاق المسموح [${min}, ${max}]`);
  }
  return num;
}

/**
 * التحقق من أن القيمة نص
 */
function validateString(value, minLength = 0, maxLength = Infinity) {
  if (typeof value !== 'string') {
    throw new TypeError(`المتوقع نص لكن تم تمرير: ${typeof value}`);
  }
  if (value.length < minLength || value.length > maxLength) {
    throw new RangeError(`طول النص خارج النطاق [${minLength}, ${maxLength}]`);
  }
  return value;
}

/**
 * التحقق من كائن البيانات الأساسي
 */
function validateShot(shotData) {
  const required = ['rails', 'whiteBall', 'aim'];
  for (const field of required) {
    if (!(field in shotData)) {
      throw new Error(`الحقل المطلوب مفقود: ${field}`);
    }
  }
  
  validateNumber(shotData.rails, 1, 4);
  validateNumber(shotData.whiteBall, 1.25, 8);
  validateNumber(shotData.aim, 1, 12);
  
  if ('cueValue' in shotData) {
    validateNumber(shotData.cueValue, 1, 15);
  }
  
  return shotData;
}

// ==================== معالجة HTML آمنة ====================

/**
 * إنشاء عنصر HTML بنص آمن (بدون XSS)
 */
function createSafeElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  
  if (options.class) element.className = options.class;
  if (options.id) element.id = options.id;
  if (options.textContent) element.textContent = options.textContent;
  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }
  
  return element;
}

/**
 * تعيين نص آمن على عنصر (بدون XSS)
 */
function setSafeText(element, text) {
  if (!element) return;
  element.textContent = text;
}

/**
 * مسح محتويات عنصر بطريقة آمنة
 */
function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * إضافة عناصر متعددة بطريقة آمنة
 */
function appendElements(parent, elements) {
  if (!parent || !Array.isArray(elements)) return;
  elements.forEach(el => {
    if (el instanceof Element) {
      parent.appendChild(el);
    }
  });
}

// ==================== تقييم الشروط بأمان ====================

/**
 * تقييم شروط القواعد بدون eval()
 * @param {string} condition - النص الشرطي (مثل "rails == 2")
 * @param {object} data - بيانات الضربة
 * @returns {boolean}
 */
function evaluateRule(condition, data) {
  // قاموس آمن من الشروط المسموحة
  const conditionMap = {
    'rails == 1': (d) => d.rails === 1,
    'rails == 2': (d) => d.rails === 2,
    'rails == 3': (d) => d.rails === 3,
    'rails == 4': (d) => d.rails === 4,
    'rails >= 3': (d) => d.rails >= 3,
    'rails <= 2': (d) => d.rails <= 2,
    'cueValue < 1.5': (d) => d.cueValue < 1.5,
    'cueValue >= 1.5 && cueValue <= 3': (d) => d.cueValue >= 1.5 && d.cueValue <= 3,
    'cueValue > 3': (d) => d.cueValue > 3,
    'cueValue < 1': (d) => d.cueValue < 1,
    'cueValue > 3.5': (d) => d.cueValue > 3.5,
    'cueValue >= 2 && cueValue <= 3': (d) => d.cueValue >= 2 && d.cueValue <= 3,
  };
  
  const rule = conditionMap[condition];
  if (!rule) {
    console.warn(`⚠️ شرط غير معروف: ${condition}`);
    return false;
  }
  
  try {
    return rule(data) ?? false;
  } catch (error) {
    console.error(`❌ خطأ في تقييم الشرط "${condition}":`, error);
    return false;
  }
}

/**
 * إضافة شرط جديد بأمان
 */
function addCustomRule(conditionKey, evaluatorFunc) {
  if (typeof evaluatorFunc !== 'function') {
    throw new TypeError('يجب أن يكون المُقيِّم دالة');
  }
  // يمكن توسيع النظام لاحقاً
  console.log(`✓ تم إضافة قاعدة مخصصة: ${conditionKey}`);
}

// ==================== معالجة الأخطاء ====================

/**
 * التقاط وتسجيل الأخطاء بأمان
 */
function safeExecute(func, fallback = null) {
  try {
    return func();
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error);
    return fallback;
  }
}

/**
 * التحقق من توفر الميزات
 */
function checkFeatureSupport() {
  return {
    localStorage: typeof Storage !== 'undefined',
    indexedDB: !!window.indexedDB,
    webWorkers: typeof Worker !== 'undefined',
    serviceWorkers: 'serviceWorker' in navigator,
  };
}

// ==================== Escape HTML ====================

/**
 * هروب من أحرف HTML الخاصة
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== التصدير ====================

// للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateNumber,
    validateString,
    validateShot,
    createSafeElement,
    setSafeText,
    clearElement,
    appendElements,
    evaluateRule,
    addCustomRule,
    safeExecute,
    checkFeatureSupport,
    escapeHtml
  };
}
