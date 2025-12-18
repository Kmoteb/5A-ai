// 📁 geometry-worker.js
// Web Worker لحسابات الهندسة المعقدة

self.onmessage = function(event) {
    const { id, data, timestamp } = event.data;
    
    try {
        let result;
        
        if (data.type === 'calculatePath') {
            result = calculateShotPath(data);
        } else if (data.type === 'calculateReflections') {
            result = calculateReflections(data);
        } else if (data.type === 'calculateAngles') {
            result = calculateAngles(data);
        } else {
            throw new Error('Unknown request type: ' + data.type);
        }
        
        self.postMessage({
            id: id,
            result: result,
            timestamp: Date.now(),
            processingTime: Date.now() - timestamp,
            success: true
        });
    } catch (error) {
        self.postMessage({
            id: id,
            error: error.message,
            timestamp: Date.now(),
            success: false
        });
    }
};

// حساب مسار الكرة
function calculateShotPath(data) {
    const { whiteBall, aim, rails, cue, path } = data;
    
    // إحداثيات الجدول (9 أقدام = 254 سم)
    const tableWidth = 254;
    const tableHeight = 127;
    
    // تحويل القياسات إلى إحداثيات
    const startX = (whiteBall / 8) * tableWidth;
    const startY = (aim / 12) * tableHeight;
    
    // حساب زاوية القوة
    const cueAngle = (cue / 15) * Math.PI;
    
    // تتبع المسار
    let currentX = startX;
    let currentY = startY;
    let pathPoints = [{ x: currentX, y: currentY }];
    
    // محاكاة المسار مع الارتدادات
    for (let i = 0; i < rails; i++) {
        const { nextX, nextY, bounce } = calculateNextBounce(
            currentX, currentY, cueAngle, tableWidth, tableHeight
        );
        
        pathPoints.push({ x: nextX, y: nextY, isBounce: true });
        
        currentX = nextX;
        currentY = nextY;
    }
    
    return {
        path: pathPoints,
        distance: calculateTotalDistance(pathPoints),
        time: calculateEstimatedTime(pathPoints),
        complexity: rails
    };
}

// حساب الارتدادات
function calculateReflections(data) {
    const { rails, angle, position } = data;
    
    let reflections = [];
    let currentAngle = angle;
    let currentX = position.x;
    let currentY = position.y;
    
    for (let i = 0; i < rails; i++) {
        const reflection = {
            number: i + 1,
            angle: currentAngle,
            position: { x: currentX, y: currentY },
            energyLoss: 0.1 * (i + 1) // 10% energy loss per bounce
        };
        
        reflections.push(reflection);
        
        // احسب الزاوية التالية
        currentAngle = reflectAngle(currentAngle, i % 2 === 0 ? 'horizontal' : 'vertical');
    }
    
    return { reflections: reflections };
}

// حساب الزوايا
function calculateAngles(data) {
    const { whiteBall, aim, rails, cue } = data;
    
    // الزاوية الأساسية
    const baseAngle = Math.atan2(aim - 6, whiteBall - 4);
    
    // الزاوية المعدلة بناءً على الكيو
    const cueAngle = (cue / 15) * Math.PI;
    
    // الزاوية النهائية
    let finalAngle = baseAngle + (cueAngle * 0.1);
    
    // تطبيع الزاوية
    while (finalAngle < 0) finalAngle += Math.PI * 2;
    while (finalAngle >= Math.PI * 2) finalAngle -= Math.PI * 2;
    
    return {
        baseAngle: (baseAngle * 180) / Math.PI,
        cueAngle: (cueAngle * 180) / Math.PI,
        finalAngle: (finalAngle * 180) / Math.PI,
        inDegrees: true
    };
}

// دالة مساعدة: حساب الارتداد التالي
function calculateNextBounce(x, y, angle, tableWidth, tableHeight) {
    // احسب نقطة الاتصال بالجدار
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    let bounceX = x;
    let bounceY = y;
    let bounceWall = null;
    
    // افحص الجدران الأفقية والعمودية
    if (cosA !== 0) {
        const tToWall = cosA > 0 
            ? (tableWidth - x) / cosA 
            : -x / cosA;
        const potentialY = y + tToWall * sinA;
        
        if (potentialY >= 0 && potentialY <= tableHeight) {
            bounceX = cosA > 0 ? tableWidth : 0;
            bounceY = potentialY;
            bounceWall = 'vertical';
        }
    }
    
    if (sinA !== 0) {
        const tToWall = sinA > 0 
            ? (tableHeight - y) / sinA 
            : -y / sinA;
        const potentialX = x + tToWall * cosA;
        
        if (potentialX >= 0 && potentialX <= tableWidth) {
            bounceX = potentialX;
            bounceY = sinA > 0 ? tableHeight : 0;
            bounceWall = 'horizontal';
        }
    }
    
    return { nextX: bounceX, nextY: bounceY, bounce: bounceWall };
}

// حساب المسافة الكلية
function calculateTotalDistance(points) {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        distance += Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
}

// حساب الوقت المقدر
function calculateEstimatedTime(points) {
    const distance = calculateTotalDistance(points);
    // بافتراض سرعة متوسطة 200 سم/ثانية
    return distance / 200;
}

// عكس الزاوية عند الارتداد
function reflectAngle(angle, wallType) {
    if (wallType === 'horizontal') {
        return -angle;
    } else {
        return Math.PI - angle;
    }
}
