/**
 * نظام التنبؤ والتحليل المتقدم
 * Prediction & Advanced Analysis System
 */

const indicators = require('./indicators');

/**
 * تحليل الاتجاه العام (Trend Analysis)
 * يحلل اتجاه السعر على مدى فترات مختلفة
 */
function analyzeTrend(closePrices, periods = [5, 10, 20]) {
  const trends = {};
  
  periods.forEach(period => {
    if (closePrices.length < period) return;
    
    const recentData = closePrices.slice(-period);
    const oldData = closePrices.slice(-period * 2, -period);
    
    const recentAvg = recentData.reduce((a, b) => a + b, 0) / period;
    const oldAvg = oldData.reduce((a, b) => a + b, 0) / period;
    
    const change = ((recentAvg - oldAvg) / oldAvg) * 100;
    
    trends[`trend_${period}`] = {
      direction: change > 0 ? 'صاعد ⬆️' : 'هابط ⬇️',
      strength: Math.abs(change).toFixed(2),
      change: change.toFixed(2),
    };
  });
  
  return trends;
}

/**
 * تحديد نقاط الدخول الثلاث تلقائياً
 * يحسب أفضل 3 نقاط للدخول بناءً على المؤشرات الفنية
 */
function calculateEntryPoints(klines, closePrices) {
  const latest = klines[klines.length - 1];
  const currentPrice = latest.close;
  const low = Math.min(...closePrices.slice(-20));
  const high = Math.max(...closePrices.slice(-20));
  
  // حساب المستويات
  const supportLevel = low;
  const resistanceLevel = high;
  const pivotPoint = (high + low + currentPrice) / 3;
  
  // حساب النسبة المئوية للحركة
  const priceRange = resistanceLevel - supportLevel;
  
  // نقاط الدخول الثلاث
  const entryPoints = [
    {
      level: 1,
      price: supportLevel,
      percentage: (((supportLevel - currentPrice) / currentPrice) * 100).toFixed(2),
      risk: 'منخفض ✅',
      description: 'نقطة دخول عند مستوى الدعم - أفضل لتوزيع رأس المال',
      profitTarget: (supportLevel + priceRange * 0.5).toFixed(2),
      stopLoss: (supportLevel - priceRange * 0.2).toFixed(2),
    },
    {
      level: 2,
      price: pivotPoint,
      percentage: (((pivotPoint - currentPrice) / currentPrice) * 100).toFixed(2),
      risk: 'متوسط ⚠️',
      description: 'نقطة دخول عند نقطة المحور - توازن بين المخاطرة والعائد',
      profitTarget: (pivotPoint + priceRange * 0.4).toFixed(2),
      stopLoss: (pivotPoint - priceRange * 0.3).toFixed(2),
    },
    {
      level: 3,
      price: resistanceLevel,
      percentage: (((resistanceLevel - currentPrice) / currentPrice) * 100).toFixed(2),
      risk: 'مرتفع ⚠️⚠️',
      description: 'نقطة دخول عند مستوى المقاومة - للمتاجرين الجريئين',
      profitTarget: (resistanceLevel + priceRange * 0.3).toFixed(2),
      stopLoss: (resistanceLevel - priceRange * 0.5).toFixed(2),
    },
  ];
  
  return {
    current_price: currentPrice,
    support_level: supportLevel.toFixed(2),
    resistance_level: resistanceLevel.toFixed(2),
    pivot_point: pivotPoint.toFixed(2),
    entry_points: entryPoints,
  };
}

/**
 * نظام التنبؤ باستخدام الانحدار الخطي
 * Linear Regression Prediction
 */
function predictNextPrice(closePrices, periods = [5, 10, 20]) {
  const predictions = {};
  
  periods.forEach(period => {
    if (closePrices.length < period) return;
    
    const recentData = closePrices.slice(-period);
    const n = recentData.length;
    
    // حساب الانحدار الخطي
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += recentData[i];
      sumXY += i * recentData[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // التنبؤ للنقطة التالية
    const predictedPrice = slope * n + intercept;
    const currentPrice = closePrices[closePrices.length - 1];
    const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    predictions[`prediction_${period}h`] = {
      predicted_price: predictedPrice.toFixed(2),
      current_price: currentPrice.toFixed(2),
      change_percent: changePercent.toFixed(2),
      direction: changePercent > 0 ? 'صاعد ⬆️' : 'هابط ⬇️',
      confidence: 'متوسط 📊',
    };
  });
  
  return predictions;
}

/**
 * حساب قوة الشراء والبيع
 * Buy/Sell Strength Analysis
 */
function calculateBuySellSignals(closePrices) {
  if (closePrices.length < 20) {
    return { signal: 'بيانات غير كافية' };
  }
  
  const sma20 = indicators.calculateSMA(closePrices, 20);
  const sma50 = indicators.calculateSMA(closePrices, 50);
  const rsi = indicators.calculateRSI(closePrices, 14);
  const ema12 = indicators.calculateEMA(closePrices, 12);
  const ema26 = indicators.calculateEMA(closePrices, 26);
  
  const lastIndex = closePrices.length - 1;
  const currentPrice = closePrices[lastIndex];
  
  let buySignals = 0;
  let sellSignals = 0;
  
  // SMA Crossover
  if (sma20[lastIndex] && sma50[lastIndex]) {
    if (sma20[lastIndex] > sma50[lastIndex]) {
      buySignals += 2;
    } else {
      sellSignals += 2;
    }
  }
  
  // RSI Signal
  if (rsi[lastIndex]) {
    if (rsi[lastIndex] < 30) {
      buySignals += 2;
    } else if (rsi[lastIndex] > 70) {
      sellSignals += 2;
    }
  }
  
  // EMA Signal
  if (ema12[lastIndex] && ema26[lastIndex]) {
    if (ema12[lastIndex] > ema26[lastIndex]) {
      buySignals += 1;
    } else {
      sellSignals += 1;
    }
  }
  
  // Price Position
  if (currentPrice > sma20[lastIndex]) {
    buySignals += 1;
  } else {
    sellSignals += 1;
  }
  
  const totalSignals = buySignals + sellSignals;
  const buyStrength = ((buySignals / totalSignals) * 100).toFixed(1);
  const sellStrength = ((sellSignals / totalSignals) * 100).toFixed(1);
  
  let recommendation = 'محايد 🔄';
  if (buySignals > sellSignals * 1.5) {
    recommendation = 'قوي: اشتري 🟢';
  } else if (sellSignals > buySignals * 1.5) {
    recommendation = 'قوي: بع 🔴';
  } else if (buySignals > sellSignals) {
    recommendation = 'ضعيف: اشتري 💚';
  } else if (sellSignals > buySignals) {
    recommendation = 'ضعيف: بع ❤️';
  }
  
  return {
    buy_strength: buyStrength,
    sell_strength: sellStrength,
    recommendation,
    signals: {
      buy_count: buySignals,
      sell_count: sellSignals,
    },
  };
}

/**
 * تحليل التقلبات (Volatility Analysis)
 */
function analyzeVolatility(closePrices, period = 20) {
  if (closePrices.length < period) {
    return { volatility: 'بيانات غير كافية' };
  }
  
  const recentData = closePrices.slice(-period);
  const avg = recentData.reduce((a, b) => a + b, 0) / period;
  
  const variance = recentData.reduce((sum, price) => {
    return sum + Math.pow(price - avg, 2);
  }, 0) / period;
  
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / avg) * 100;
  
  let level = 'منخفض 📉';
  if (coefficientOfVariation > 5) level = 'متوسط 📊';
  if (coefficientOfVariation > 10) level = 'مرتفع 📈';
  
  return {
    volatility_level: level,
    standard_deviation: stdDev.toFixed(2),
    coefficient_variation: coefficientOfVariation.toFixed(2),
    avg_price: avg.toFixed(2),
  };
}

/**
 * تقرير التحليل الشامل
 * Comprehensive Analysis Report
 */
function generateComprehensiveReport(klines, symbol) {
  const closePrices = klines.map(k => k.close);
  
  const report = {
    symbol,
    timestamp: Date.now(),
    current_price: klines[klines.length - 1].close.toFixed(2),
    
    // التحليل الأساسي
    trend_analysis: analyzeTrend(closePrices),
    
    // نقاط الدخول
    entry_points: calculateEntryPoints(klines, closePrices),
    
    // التنبؤات
    price_predictions: predictNextPrice(closePrices),
    
    // إشارات الشراء والبيع
    buy_sell_signals: calculateBuySellSignals(closePrices),
    
    // تحليل التقلبات
    volatility: analyzeVolatility(closePrices),
    
    // ملخص التوصية
    summary: {
      best_entry: calculateEntryPoints(klines, closePrices).entry_points[0],
      market_sentiment: calculateBuySellSignals(closePrices).recommendation,
      risk_level: analyzeVolatility(closePrices).volatility_level,
    },
  };
  
  return report;
}

module.exports = {
  analyzeTrend,
  calculateEntryPoints,
  predictNextPrice,
  calculateBuySellSignals,
  analyzeVolatility,
  generateComprehensiveReport,
};
