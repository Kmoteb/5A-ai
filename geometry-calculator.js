// 📁 geometry-calculator.js
class GeometryCalculator {
    constructor() {
        this.tableDimensions = {
            width: 254, // cm (9ft table)
            height: 127, // cm
            pocketRadius: 8.5 // cm
        };
    }
    
    // حساب الزوايا بناءً على قياسات 5A
    calculateShotGeometry(whiteBall, aim, cueMeasurement) {
        const whiteBallPos = this.measurementToCoordinates(whiteBall);
        const aimPos = this.aimToCoordinates(aim);
        
        // حساب مسار الكرة المستهدفة
        const targetPath = this.calculateTargetPath(whiteBallPos, aimPos);
        
        // حساب نقطة الارتكاز على الجدار الأول
        const firstRailContact = this.calculateFirstRailContact(
            whiteBallPos, 
            targetPath, 
            cueMeasurement
        );
        
        // حساب زوايا الانعكاس
        const reflectionAngles = this.calculateReflectionAngles(
            firstRailContact, 
            targetPath, 
            cueMeasurement.rails
        );
        
        // حساب نقطة توقف الكرة البيضاء
        const whiteBallFinalPos = this.calculateWhiteBallFinalPosition(
            whiteBallPos,
            cueMeasurement,
            reflectionAngles
        );
        
        return {
            whiteBall: whiteBallPos,
            target: aimPos,
            firstRailContact,
            reflectionAngles,
            whiteBallFinalPos,
            difficultyScore: this.calculateGeometricDifficulty(
                whiteBallPos,
                firstRailContact,
                reflectionAngles
            ),
            visualizationData: this.generateVisualizationData(
                whiteBallPos,
                firstRailContact,
                reflectionAngles,
                aimPos
            )
        };
    }
    
    // تحويل قياس 5A إلى إحداثيات حقيقية
    measurementToCoordinates(measurement) {
        // نظام القياس 5A يعتمد على طول الجدار
        // 0 = الزاوية القصيرة, 8 = الزاوية الطويلة
        const percentage = measurement / 8;
        
        return {
            x: percentage * this.tableDimensions.width,
            y: 0 // على الجدار الأفقي (long rail)
        };
    }
    
    aimToCoordinates(aim) {
        if (aim === 'جيب الزاوية') {
            return {
                x: this.tableDimensions.width * 0.9,
                y: this.tableDimensions.height * 0.1
            };
        }
        
        const aimValue = parseFloat(aim);
        const percentage = aimValue / 9; // 9 = maximum diamond
        
        return {
            x: percentage * this.tableDimensions.width,
            y: this.tableDimensions.height * 0.05 + Math.random() * 0.1 // variation
        };
    }
    
    calculateFirstRailContact(whiteBallPos, targetPath, cueMeasurement) {
        const cuePower = cueMeasurement.cue > 10 ? (cueMeasurement.cue - 10) * 10 : cueMeasurement.cue;
        const speedFactor = cuePower / 5; // Normalize to 0-2
        
        // حساب نقطة الارتكاز بناءً على قانون انعكاس الزاوية
        const angleOfIncidence = Math.atan2(
            targetPath.y - whiteBallPos.y,
            targetPath.x - whiteBallPos.x
        );
        
        // معادلة الانعكاس: زاوية الحادث = زاوية الانعكاس
        const reflectionAngle = angleOfIncidence;
        
        // حساب نقطة التقاطع مع الجدار
        const distanceToRail = (this.tableDimensions.height - whiteBallPos.y);
        const contactPoint = {
            x: whiteBallPos.x + Math.tan(reflectionAngle) * distanceToRail,
            y: this.tableDimensions.height
        };
        
        // التحقق من صحة الحدود
        contactPoint.x = Math.max(0, Math.min(this.tableDimensions.width, contactPoint.x));
        
        return {
            coordinates: contactPoint,
            angle: reflectionAngle,
            speed: speedFactor
        };
    }
    
    calculateReflectionAngles(firstContact, targetPath, railCount) {
        const angles = [];
        
        for (let i = 0; i < railCount; i++) {
            const prevAngle = i === 0 ? firstContact.angle : angles[i - 1].angle;
            
            // معادلة الانعكاس مع تقليل السرعة
            const reflectedAngle = Math.PI - prevAngle;
            const reducedSpeed = firstContact.speed * Math.pow(0.9, i + 1);
            
            angles.push({
                railNumber: i + 1,
                angle: reflectedAngle,
                speed: reducedSpeed,
                englishRequired: this.calculateEnglishRequirement(reflectedAngle, reducedSpeed)
            });
        }
        
        return angles;
    }
    
    calculateEnglishRequirement(angle, speed) {
        // حساب الإنجليزية المطلوبة بناءً على الزاوية والسرعة
        const angleDeg = Math.abs(angle * 180 / Math.PI);
        const baseEnglish = angleDeg > 45 ? 0.7 : 0.3;
        const speedAdjustment = speed > 1.5 ? 0.2 : -0.1;
        
        return Math.min(1, Math.max(0, baseEnglish + speedAdjustment));
    }
    
    calculateGeometricDifficulty(whiteBallPos, firstContact, reflectionAngles) {
        let difficulty = 0;
        
        // عامل المسافة
        const distanceToRail = Math.hypot(
            firstContact.coordinates.x - whiteBallPos.x,
            firstContact.coordinates.y - whiteBallPos.y
        );
        difficulty += Math.min(distanceToRail / 100, 1) * 2;
        
        // عامل الزاوية
        const sharpness = Math.abs(Math.sin(firstContact.angle));
        difficulty += sharpness * 3;
        
        // عامل الجدرات المتعددة
        difficulty += reflectionAngles.length * 1.5;
        
        // عامل السرعة
        difficulty += Math.abs(firstContact.speed - 1) * 1;
        
        return Math.min(10, difficulty);
    }
    
    generateVisualizationData(whiteBall, firstContact, reflections, target) {
        const points = [whiteBall, firstContact.coordinates];
        
        // إضافة نقاط الانعكاس
        let currentPos = firstContact.coordinates;
        for (let i = 0; i < reflections.length; i++) {
            const nextPoint = this.calculateNextReflectionPoint(
                currentPos,
                reflections[i].angle,
                i + 1
            );
            points.push(nextPoint);
            currentPos = nextPoint;
        }
        
        return {
            type: 'polyline',
            points: points,
            target: target,
            annotations: reflections.map((r, i) => ({
                rail: r.railNumber,
                angle: (r.angle * 180 / Math.PI).toFixed(1) + '°',
                speed: r.speed.toFixed(2)
            }))
        };
    }
}
