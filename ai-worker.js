// 📁 ai-worker.js
// Web Worker لمعالجة الحسابات الثقيلة بشكل متوازي

self.onmessage = function(event) {
    const { id, data, timestamp } = event.data;
    
    try {
        let result;
        
        // معالجة أنواع مختلفة من الطلبات
        if (data.type === 'analyze') {
            result = analyzeShot(data);
        } else if (data.type === 'train') {
            result = trainModel(data);
        } else if (data.type === 'predict') {
            result = makePrediction(data);
        } else {
            throw new Error('Unknown request type: ' + data.type);
        }
        
        // إرسال النتيجة
        self.postMessage({
            id: id,
            result: result,
            timestamp: Date.now(),
            processingTime: Date.now() - timestamp,
            success: true
        });
    } catch (error) {
        // معالجة الأخطاء
        self.postMessage({
            id: id,
            error: error.message,
            timestamp: Date.now(),
            success: false
        });
    }
};

// تحليل الضربة
function analyzeShot(data) {
    const { rails, whiteBall, aim, cue, path } = data;
    
    // حسابات معقدة
    let score = 0;
    let confidence = 0.5;
    
    // خوارزمية تحليل بسيطة
    if (rails <= 2) {
        score = Math.min(100, 50 + (whiteBall * 10) - (Math.abs(aim - 5) * 3));
        confidence = 0.8;
    } else {
        score = Math.min(100, 40 + (whiteBall * 5) - (rails * 2));
        confidence = 0.6;
    }
    
    return {
        successPrediction: Math.round(score),
        confidence: confidence,
        difficulty: calculateDifficulty(rails, aim),
        recommendation: generateRecommendation(rails, whiteBall, aim)
    };
}

// تدريب النموذج
function trainModel(data) {
    const { samples } = data;
    
    if (!samples || samples.length === 0) {
        return { trained: false, error: 'No samples provided' };
    }
    
    // حساب المتوسطات والانحرافات
    let totalScore = 0;
    let successCount = 0;
    
    samples.forEach(sample => {
        totalScore += sample.score || 0;
        if (sample.success) successCount++;
    });
    
    return {
        trained: true,
        samplesProcessed: samples.length,
        successRate: (successCount / samples.length) * 100,
        averageScore: totalScore / samples.length,
        timestamp: Date.now()
    };
}

// التنبؤ
function makePrediction(data) {
    const { features } = data;
    
    // استخدام الخصائص للتنبؤ
    let prediction = 0.5;
    
    if (features) {
        // معادلة خطية بسيطة للتنبؤ
        prediction = 0.1 * features.rails + 
                    0.2 * features.whiteBall + 
                    0.15 * features.aim +
                    0.1;
        
        // تطبيع النتيجة بين 0 و 1
        prediction = Math.max(0, Math.min(1, prediction));
    }
    
    return {
        prediction: Math.round(prediction * 100),
        confidence: 0.7 + (Math.random() * 0.2)
    };
}

// حساب درجة الصعوبة
function calculateDifficulty(rails, aim) {
    let difficulty = 'متوسط';
    let score = 50;
    
    if (rails === 1) {
        difficulty = 'سهل';
        score = 30;
    } else if (rails >= 3) {
        difficulty = 'صعب';
        score = 70;
    }
    
    if (aim < 3 || aim > 7) {
        score += 10;
    }
    
    return { level: difficulty, score: Math.min(100, score) };
}

// توليد التوصيات
function generateRecommendation(rails, whiteBall, aim) {
    const recommendations = [];
    
    if (rails === 1) {
        recommendations.push('ركز على الدقة أكثر من القوة');
        recommendations.push('تأكد من نظافة نقطة الارتكاز');
    } else if (rails === 2) {
        recommendations.push('احسب زاوية الخروج من الجدار الأول');
        recommendations.push('استخدم إنجليزية خفيفة');
    } else if (rails >= 3) {
        recommendations.push('التوقيت أهم من القوة');
        recommendations.push('ركز على نقطة التحول عند الجدار الثاني');
    }
    
    if (whiteBall < 1.5) {
        recommendations.push('قوة خفيفة لهذا الموضع');
    } else if (whiteBall > 6) {
        recommendations.push('قوة قوية ممكنة من هذا الموضع');
    }
    
    return recommendations;
}
