// 📁 5A-ai.js
// نظام الذكاء الاصطناعي المتقدم لـ 5A

class FiveAAI {
    constructor() {
        // نموذج التعلم
        this.learningModel = {
            patterns: [],
            predictions: [],
            accuracyHistory: [],
            lastTraining: null
        };
        
        // قاعدة المعرفة
        this.knowledgeBase = this.createKnowledgeBase();
        this.isLearning = true;
        this.learningRate = 0.1;
        
        // تحميل البيانات المحفوظة
        this.loadModel();
        
        console.log('🧠 نظام 5A الذكي جاهز للتعلم');
    }
    
    createKnowledgeBase() {
        return {
            // قواعد الأساسية
            rules: [
                {
                    condition: "rails == 1",
                    advice: "ضربة مباشرة، ركز على الدقة أكثر من القوة",
                    tips: ["تأكد من نظافة نقطة الارتكاز", "القوة المتوسطة مثالية"]
                },
                {
                    condition: "rails == 2",
                    advice: "الجدار الثاني هو الأهم، احسب زاوية الخروج أولاً",
                    tips: ["استخدم إنجليزية خفيفة", "ركز على نقطة الارتطام الثانية"]
                },
                {
                    condition: "rails >= 3",
                    advice: "التوقيت أهم من القوة في الانعكاسات المتعددة",
                    tips: ["نقطة التحول عند الجدار الثاني", "متابعة طويلة للكيو"]
                },
                {
                    condition: "cueValue < 1.5",
                    advice: "قوة خفيفة، مثالية للمسافات القصيرة",
                    tips: ["دقة عالية", "متابعة خفيفة"]
                },
                {
                    condition: "cueValue >= 1.5 && cueValue <= 3",
                    advice: "قوة متوسطة، تناسب معظم الضربات",
                    tips: ["توازن بين القوة والدقة", "إنجليزية متوسطة"]
                },
                {
                    condition: "cueValue > 3",
                    advice: "قوة عالية، تستخدم للمسافات الطويلة أو الانعكاسات",
                    tips: ["تحكم جيد في الكيو", "إنجليزية قوية"]
                }
            ],
            
            // نقاط الارتطام الشائعة وفعاليتها
            contactPointsEffectiveness: {
                'long_3': { successRate: 85, difficulty: 4, description: "نقطة متوسطة مثالية للانعكاسات" },
                'long_4': { successRate: 80, difficulty: 5, description: "توازن جيد بين القوة والزاوية" },
                'long_5': { successRate: 75, difficulty: 6, description: "مناسبة للمسافات الطويلة" },
                'short_2': { successRate: 82, difficulty: 5, description: "نقطة جيدة للضربات الجانبية" }
            },
            
            // أنماط الضربات الناجحة
            successfulPatterns: [
                { contact: 'long_3', target: 'pocket_tr', cue: 2.5, rails: 2, success: 88 },
                { contact: 'long_4', target: 'pocket_bl', cue: 3.0, rails: 3, success: 76 },
                { contact: 'short_2', target: 'pocket_br', cue: 2.0, rails: 1, success: 92 }
            ],
            
            // أخطاء شائعة وتصحيحاتها
            commonMistakes: [
                {
                    mistake: "القوة الزائدة في المسافات القصيرة",
                    correction: "استخدم 50-60% قوة فقط",
                    result: "تحسن الدقة بنسبة 30%"
                },
                {
                    mistake: "إنجليزية مفرطة في الضربات المباشرة",
                    correction: "خفف الإنجليزية أو استغني عنها",
                    result: "مسار أكثر استقامة"
                },
                {
                    mistake: "تجاهل موقع الكرة البيضاء بعد الضربة",
                    correction: "خطط لموقف الكرة البيضاء مسبقاً",
                    result: "موقف أفضل للضربة التالية"
                }
            ]
        };
    }
    
    // تحليل ضربة باستخدام الذكاء الاصطناعي
    analyzeShot(shotData) {
        // التحليل الأساسي
        const basicAnalysis = this.basicAnalysis(shotData);
        
        // التنبؤ بالنجاح
        const successPrediction = this.predictSuccess(shotData);
        
        // توليد التوصيات
        const recommendations = this.generateRecommendations(shotData);
        
        // اكتشاف الأخطاء المحتملة
        const potentialMistakes = this.detectPotentialMistakes(shotData);
        
        // مقارنة مع أنماط ناجحة
        const similarSuccessfulShots = this.findSimilarSuccessfulShots(shotData);
        
        // تحديث نموذج التعلم
        if (this.isLearning) {
            this.learnFromShot(shotData, successPrediction);
        }
        
        return {
            ...basicAnalysis,
            successPrediction,
            recommendations,
            potentialMistakes,
            similarSuccessfulShots,
            aiConfidence: this.calculateConfidence(shotData)
        };
    }
    
    // التحليل الأساسي
    basicAnalysis(shotData) {
        const difficulty = this.calculateDifficulty(shotData);
        const complexity = this.assessComplexity(shotData);
        const riskLevel = this.calculateRiskLevel(shotData);
        
        return {
            difficulty: {
                score: difficulty,
                level: this.getDifficultyLevel(difficulty),
                factors: this.identifyDifficultyFactors(shotData)
            },
            complexity: {
                score: complexity,
                description: this.getComplexityDescription(complexity)
            },
            riskLevel: {
                score: riskLevel,
                warning: riskLevel > 7 ? "عالية" : riskLevel > 4 ? "متوسطة" : "منخفضة"
            },
            executionTips: this.generateExecutionTips(shotData)
        };
    }
    
    // حساب الصعوبة
    calculateDifficulty(shotData) {
        let score = 0;
        
        // تأثير عدد الجدران
        score += (shotData.rails - 1) * 2;
        
        // تأثير قيمة الكيو
        score += Math.abs(shotData.cueValue - 2.5) * 0.5;
        
        // تأثير نقطة الارتطام
        const contactEffectiveness = this.knowledgeBase.contactPointsEffectiveness[shotData.contactPoint];
        if (contactEffectiveness) {
            score += contactEffectiveness.difficulty / 2;
        }
        
        return Math.min(10, Math.round(score * 10) / 10);
    }
    
    // تقييم التعقيد
    assessComplexity(shotData) {
        let complexity = shotData.rails * 1.5;
        
        // زيادة التعقيد إذا كانت قيمة الكيو متطرفة
        if (shotData.cueValue < 1 || shotData.cueValue > 4) {
            complexity += 1;
        }
        
        // زيادة التعقيد إذا كانت الملاحظات تشير إلى صعوبة
        if (shotData.notes && (shotData.notes.includes('صعب') || shotData.notes.includes('معقد'))) {
            complexity += 1.5;
        }
        
        return Math.min(10, complexity);
    }
    
    // حساب مستوى المخاطرة
    calculateRiskLevel(shotData) {
        let risk = shotData.rails * 1.2;
        
        // زيادة المخاطرة مع قيم الكيو المتطرفة
        if (shotData.cueValue > 3.5) risk += 1.5;
        if (shotData.cueValue < 1) risk += 1;
        
        // تقليل المخاطرة للضربات المباشرة
        if (shotData.rails === 1) risk *= 0.7;
        
        return Math.min(10, Math.round(risk * 10) / 10);
    }
    
    // التنبؤ بنسبة النجاح
    predictSuccess(shotData) {
        // البدء من قاعدة 75%
        let prediction = 75;
        
        // تطبيق قواعد (بدون eval للأمان)
        this.knowledgeBase.rules.forEach(rule => {
            if (this.evaluateRuleSafely(rule.condition, shotData)) {
                prediction += 5;
            }
        });
        
        // تعديل حسب نقطة الارتطام
        const contactEffect = this.knowledgeBase.contactPointsEffectiveness[shotData.contactPoint];
        if (contactEffect) {
            prediction += (contactEffect.successRate - 80) / 2;
        }
        
        // تعديل حسب عدد الجدران
        prediction -= (shotData.rails - 1) * 8;
        
        // تعديل حسب قيمة الكيو
        if (shotData.cueValue < 1 || shotData.cueValue > 4) {
            prediction -= 10;
        } else if (shotData.cueValue >= 2 && shotData.cueValue <= 3) {
            prediction += 8;
        }
        
        // الحدود
        return Math.max(20, Math.min(95, Math.round(prediction)));
    }
    
    // توليد التوصيات
    generateRecommendations(shotData) {
        const recommendations = [];
        
        // تطبيق القواعس المناسبة (بدون eval للأمان)
        this.knowledgeBase.rules.forEach(rule => {
            if (this.evaluateRuleSafely(rule.condition, shotData)) {
                recommendations.push({
                    type: 'rule',
                    priority: 'high',
                    text: rule.advice,
                    tips: rule.tips
                });
            }
        });
        
        // توصيات بناءً على نقطة الارتطام
        const contactEffect = this.knowledgeBase.contactPointsEffectiveness[shotData.contactPoint];
        if (contactEffect) {
            recommendations.push({
                type: 'contact',
                priority: 'medium',
                text: contactEffect.description,
                tips: [`نسبة النجاح التاريخية: ${contactEffect.successRate}%`]
            });
        }
        
        // توصيات بناءً على الملاحظات
        if (shotData.notes) {
            if (shotData.notes.includes('إنجليزية')) {
                recommendations.push({
                    type: 'spin',
                    priority: 'medium',
                    text: 'للإنجليزية الجيدة: متابعة طويلة وسلسة للكيو',
                    tips: ['لا توقف الكيو فجأة', 'اتبع حركة الكرة المستهدفة']
                });
            }
            
            if (shotData.notes.includes('قوة')) {
                recommendations.push({
                    type: 'power',
                    priority: 'high',
                    text: 'تحكم في القوة حسب المسافة',
                    tips: ['المسافات القصيرة: 60-70%', 'المسافات الطويلة: 80-90%']
                });
            }
        }
        
        // تصحيح الأخطاء الشائعة
        const mistake = this.detectCommonMistake(shotData);
        if (mistake) {
            recommendations.push({
                type: 'correction',
                priority: 'high',
                text: `تجنب: ${mistake.mistake}`,
                tips: [`التصحيح: ${mistake.correction}`, `النتيجة: ${mistake.result}`]
            });
        }
        
        return recommendations;
    }
    
    // اكتشاف الأخطاء المحتملة
    detectPotentialMistakes(shotData) {
        const mistakes = [];
        
        // تحقق من القوة المفرطة
        if (shotData.cueValue > 3.5 && shotData.rails === 1) {
            mistakes.push({
                type: 'overpower',
                description: 'قوة مفرطة لضربة بجدار واحد',
                severity: 'medium',
                suggestion: 'خفف القوة إلى 2.5-3.0'
            });
        }
        
        // تحقق من الجدران المتعددة مع قوة ضعيفة
        if (shotData.cueValue < 1.5 && shotData.rails >= 3) {
            mistakes.push({
                type: 'underpower',
                description: 'قوة ضعيفة جداً لضربة بجدرات متعددة',
                severity: 'high',
                suggestion: 'زود القوة إلى 2.5 على الأقل'
            });
        }
        
        return mistakes;
    }
    
    // اكتشاف أخطاء شائعة
    detectCommonMistake(shotData) {
        return this.knowledgeBase.commonMistakes.find(mistake => {
            if (mistake.mistake.includes("القوة الزائدة") && shotData.cueValue > 3.5) {
                return true;
            }
            if (mistake.mistake.includes("إنجليزية مفرطة") && shotData.notes && shotData.notes.includes("إنجليزية")) {
                return true;
            }
            return false;
        });
    }
    
    // البحث عن ضربات ناجحة مشابهة
    findSimilarSuccessfulShots(shotData) {
        return this.knowledgeBase.successfulPatterns
            .filter(pattern => 
                pattern.rails === shotData.rails &&
                Math.abs(pattern.cue - shotData.cueValue) < 1
            )
            .slice(0, 3)
            .map(pattern => ({
                ...pattern,
                similarity: this.calculateSimilarity(shotData, pattern)
            }));
    }
    
    // حساب التشابه بين الضربات
    calculateSimilarity(shot1, shot2) {
        let similarity = 0;
        
        if (shot1.rails === shot2.rails) similarity += 40;
        if (Math.abs(shot1.cueValue - shot2.cue) < 0.5) similarity += 30;
        if (shot1.contactPoint === shot2.contact) similarity += 20;
        
        return similarity;
    }
    
    // توليد نصائح التنفيذ
    generateExecutionTips(shotData) {
        const tips = [];
        
        // نصائح عامة
        tips.push("قبل الضربة: خذ نفساً عميقاً وحدد هدفك بوضوح");
        tips.push("أثناء الضربة: حركة سلسة ومتابعة للكيو");
        tips.push("بعد الضربة: راقب مسار الكرة وتعلم من النتيجة");
        
        // نصائح خاصة بعدد الجدران
        if (shotData.rails === 1) {
            tips.push("ركز على نقطة الارتطام بالجدار");
            tips.push("القوة المتوسطة تعطي أفضل النتائج");
        } else if (shotData.rails === 2) {
            tips.push("احسب زاوية الانعكاس الثاني أولاً");
            tips.push("استخدم إنجليزية خفيفة لضبط المسار");
        } else if (shotData.rails >= 3) {
            tips.push("التوقيت الدقيق أهم من القوة");
            tips.push("ركز على الجدار الثاني كنقطة تحول");
        }
        
        return tips;
    }
    
    // التعلم من الضربة
    learnFromShot(shotData, predictedSuccess) {
        // تسجيل النمط
        const pattern = {
            ...shotData,
            predictedSuccess,
            timestamp: new Date().toISOString()
        };
        
        this.learningModel.patterns.push(pattern);
        
        // حفظ فقط آخر 1000 نمط
        if (this.learningModel.patterns.length > 1000) {
            this.learningModel.patterns = this.learningModel.patterns.slice(-1000);
        }
        
        // حفظ النموذج
        this.saveModel();
    }
    
    // حساب ثقة الذكاء الاصطناعي
    calculateConfidence(shotData) {
        let confidence = 70; // الثقة الأساسية
        
        // زيادة الثقة مع وجود أنماط مشابهة
        const similarShots = this.findSimilarSuccessfulShots(shotData);
        if (similarShots.length > 0) {
            confidence += Math.min(20, similarShots.length * 5);
        }
        
        // زيادة الثقة مع نقاط ارتكاز معروفة
        if (this.knowledgeBase.contactPointsEffectiveness[shotData.contactPoint]) {
            confidence += 5;
        }
        
        // تقليل الثقة للقيم المتطرفة
        if (shotData.cueValue < 1 || shotData.cueValue > 4) {
            confidence -= 10;
        }
        
        return Math.max(30, Math.min(95, confidence));
    }
    
    // الحصول على مستوى الصعوبة
    getDifficultyLevel(score) {
        if (score <= 3) return 'سهل';
        if (score <= 6) return 'متوسط';
        if (score <= 8) return 'صعب';
        return 'صعب جداً';
    }
    
    // تحديد عوامل الصعوبة
    identifyDifficultyFactors(shotData) {
        const factors = [];
        
        if (shotData.rails >= 3) factors.push('جدرات متعددة');
        if (shotData.cueValue > 3.5) factors.push('قوة عالية');
        if (shotData.cueValue < 1.5) factors.push('تحكم دقيق');
        
        return factors.length > 0 ? factors : ['قياسية'];
    }
    
    // الحصول على وصف التعقيد
    getComplexityDescription(score) {
        if (score <= 4) return 'بسيطة';
        if (score <= 7) return 'متوسطة التعقيد';
        return 'معقدة';
    }
    
    // حفظ نموذج التعلم
    saveModel() {
        try {
            localStorage.setItem('5a_ai_model', JSON.stringify(this.learningModel));
        } catch (error) {
            console.error('فشل حفظ نموذج الذكاء الاصطناعي:', error);
        }
    }
    
    // تحميل نموذج التعلم
    loadModel() {
        try {
            const savedModel = localStorage.getItem('5a_ai_model');
            if (savedModel) {
                this.learningModel = JSON.parse(savedModel);
            }
        } catch (error) {
            console.error('فشل تحميل نموذج الذكاء الاصطناعي:', error);
        }
    }
}

// 📁 5A-ai.js (نسخة ML متقدمة)
class AdvancedMLModel {
    constructor() {
        // بنية الشبكة العصبية البسيطة
        this.model = {
            layers: [
                { units: 8, activation: 'relu', weights: [], biases: [] }, // Input layer
                { units: 16, activation: 'relu', weights: [], biases: [] }, // Hidden
                { units: 8, activation: 'relu', weights: [], biases: [] }, // Hidden
                { units: 1, activation: 'sigmoid', weights: [], biases: [] } // Output
            ],
            learningRate: 0.001,
            batchSize: 32,
            epochs: 50
        };
        
        // Feature extraction متقدم
        this.featureExtractor = new FeatureExtractor();
        
        // Dataset
        this.dataset = {
            features: [],
            labels: [],
            size: 0
        };
        
        this.initializeModel();
        this.loadModelFromStorage();
    }
    
    // تهيئة الأوزان باستخدام Xavier initialization
    initializeModel() {
        const layers = this.model.layers;
        for (let i = 0; i < layers.length - 1; i++) {
            const inputSize = layers[i].units;
            const outputSize = layers[i + 1].units;
            
            // Xavier initialization
            const limit = Math.sqrt(6 / (inputSize + outputSize));
            layers[i + 1].weights = this.randomMatrix(outputSize, inputSize, -limit, limit);
            layers[i + 1].biases = new Array(outputSize).fill(0).map(() => 
                Math.random() * 0.1 - 0.05
            );
        }
    }
    
    // التحليل باستخدام الشبكة العصبية
    analyzeShot(shotData) {
        // Feature engineering
        const features = this.featureExtractor.extractFeatures(shotData);
        
        // Forward pass
        const prediction = this.forwardPass(features);
        
        // Generate recommendations with attention mechanism
        const recommendations = this.generateSmartRecommendations(shotData, features);
        
        // Calculate confidence interval
        const confidence = this.calculateConfidenceInterval(features);
        
        // Detect anomalies
        const anomalies = this.detectAnomalies(features);
        
        return {
            successPrediction: Math.round(prediction * 100),
            confidence: confidence,
            recommendations: recommendations,
            anomalies: anomalies,
            featureImportance: this.getFeatureImportance(features)
        };
    }
    
    // Forward pass حقيقي
    forwardPass(input) {
        let activation = input;
        
        for (let i = 1; i < this.model.layers.length; i++) {
            const layer = this.model.layers[i];
            const previousLayer = this.model.layers[i - 1];
            
            // Matrix multiplication + bias
            const z = this.matrixMultiply(layer.weights, activation)
                .map((val, idx) => val + layer.biases[idx]);
            
            // Activation function
            activation = z.map(val => this.activate(val, layer.activation));
        }
        
        return activation[0]; // Single output
    }
    
    // Backpropagation للتعلم
    backwardPass(input, target) {
        // Forward cache
        const activations = [input];
        const zs = [];
        
        for (let i = 1; i < this.model.layers.length; i++) {
            const layer = this.model.layers[i];
            const prevActivation = activations[i - 1];
            
            const z = this.matrixMultiply(layer.weights, prevActivation)
                .map((val, idx) => val + layer.biases[idx]);
            zs.push(z);
            
            const activation = z.map(val => this.activate(val, layer.activation));
            activations.push(activation);
        }
        
        // Backward pass
        const output = activations[activations.length - 1];
        let delta = [output[0] - target]; // Derivative of MSE
        
        // Update weights for output layer
        const outputLayer = this.model.layers[this.model.layers.length - 1];
        const hiddenLayer = activations[activations.length - 2];
        
        for (let j = 0; j < outputLayer.weights.length; j++) {
            for (let k = 0; k < outputLayer.weights[j].length; k++) {
                outputLayer.weights[j][k] -= this.model.learningRate * delta[j] * hiddenLayer[k];
            }
            outputLayer.biases[j] -= this.model.learningRate * delta[j];
        }
        
        // Backpropagate to hidden layers
        for (let l = this.model.layers.length - 2; l > 0; l--) {
            const layer = this.model.layers[l];
            const nextLayer = this.model.layers[l + 1];
            const activation = activations[l];
            const z = zs[l - 1];
            
            // Calculate delta for this layer
            const newDelta = new Array(layer.units).fill(0);
            for (let i = 0; i < layer.units; i++) {
                let sum = 0;
                for (let j = 0; j < nextLayer.units; j++) {
                    sum += nextLayer.weights[j][i] * delta[j];
                }
                newDelta[i] = sum * this.activateDerivative(z[i], layer.activation);
            }
            delta = newDelta;
            
            // Update weights
            const prevActivation = activations[l - 1];
            for (let i = 0; i < layer.weights.length; i++) {
                for (let j = 0; j < layer.weights[i].length; j++) {
                    layer.weights[i][j] -= this.model.learningRate * delta[i] * prevActivation[j];
                }
                layer.biases[i] -= this.model.learningRate * delta[i];
            }
        }
    }
}

// Feature extraction متقدم
class FeatureExtractor {
    extractFeatures(shotData) {
        return [
            this.normalizeRails(shotData.rails),
            this.normalizeCue(shotData.cueMeasurement),
            this.normalizePath(shotData.pathMeasurement),
            this.normalizeWhiteBall(shotData.whiteBallMeasurement),
            this.calculateAngleComplexity(shotData),
            this.calculatePowerToDistanceRatio(shotData),
            this.encodeNotes(shotData.notes),
            this.calculateRailDistance(shotData),
            this.estimateSpinRequirement(shotData),
            this.calculateRiskScore(shotData)
        ];
    }
    
    normalizeRails(rails) { return rails / 4; }
    normalizeCue(cue) { 
        const realCue = cue > 10 ? (cue - 10) : cue;
        return realCue / 10; 
    }
    normalizePath(path) { return path / 10; }
    normalizeWhiteBall(wb) { return wb / 8; }
    
    calculateAngleComplexity(shotData) {
        return Math.abs(shotData.whiteBallMeasurement - shotData.aimMeasurement) / 10;
    }
    
    calculatePowerToDistanceRatio(shotData) {
        const distance = Math.abs(shotData.aimMeasurement - shotData.whiteBallMeasurement);
        return shotData.cueMeasurement / (distance + 1);
    }
    
    encodeNotes(notes) {
        if (!notes) return 0;
        const keywords = {
            'إنجليزية': 0.3,
            'قوة': 0.2,
            'دقة': 0.1,
            'صعب': 0.4
        };
        return Object.keys(keywords).reduce((score, word) => 
            notes.includes(word) ? score + keywords[word] : score, 0
        );
    }
    
    calculateRailDistance(shotData) {
        return Math.min(shotData.rails * 0.25, 1);
    }
    
    estimateSpinRequirement(shotData) {
        return shotData.rails > 2 ? 0.7 : 0.3;
    }
    
    calculateRiskScore(shotData) {
        const cue = shotData.cueMeasurement > 10 ? (shotData.cueMeasurement - 10) : shotData.cueMeasurement;
        return (shotData.rails * 0.4 + Math.abs(cue - 2.5) * 0.2 + (cue > 3.5 ? 0.3 : 0)) / 3;
    }
    
    // ✅ دالة آمنة لتقييم الشروط (بدون eval)
    evaluateRuleSafely(condition, data) {
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
}


// إنشاء نسخة عالمية من الذكاء الاصطناعي
const fiveAAI = new FiveAAI();

// تصدير للاستخدام العالمي
window.FiveAAI = fiveAAI;