/**
 * صفحة التحليل مع نقاط الدخول - Analysis Page with Entry Points
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalysisPage = () => {
  const [symbol, setSymbol] = useState('bitcoin');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const supportedCoins = [
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
    { id: 'cardano', name: 'Cardano', icon: '₳' },
    { id: 'solana', name: 'Solana', icon: '◎' },
    { id: 'ripple', name: 'Ripple', icon: '✕' },
    { id: 'dogecoin', name: 'Dogecoin', icon: 'Ð' },
    { id: 'polkadot', name: 'Polkadot', icon: '●' },
    { id: 'litecoin', name: 'Litecoin', icon: 'Ł' },
    { id: 'chainlink', name: 'Chainlink', icon: '⛓' },
    { id: 'uniswap', name: 'Uniswap', icon: '🦄' },
  ];

  // جلب التحليل
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/analysis', {
          params: { symbol },
        });
        setAnalysis(response.data.analysis);
      } catch (err) {
        setError(err.message || 'فشل جلب التحليل');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">جاري تحليل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900 border border-red-700 p-6 rounded-lg">
            <p className="text-red-200">❌ خطأ: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 تحليل العملات</h1>
          <p className="text-gray-400">تحليل شامل مع نقاط دخول أوتوماتيكية</p>
        </div>

        {/* Coin Selector */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">اختر عملة</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3">
            {supportedCoins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => setSymbol(coin.id)}
                className={`p-4 rounded-lg font-semibold transition ${
                  symbol === coin.id
                    ? 'bg-blue-600 text-white border-2 border-blue-700'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{coin.icon}</div>
                <div className="text-sm">{coin.name}</div>
              </button>
            ))}
          </div>
        </div>

        {analysis && (
          <>
            {/* Current Price Section */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-lg mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300 mb-2">السعر الحالي</p>
                  <h2 className="text-5xl font-bold">
                    ${analysis.current_price}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl mb-4">
                    {analysis.summary?.market_sentiment}
                  </div>
                  <p className="text-gray-300">تقييم السوق</p>
                </div>
              </div>
            </div>

            {/* Entry Points - نقاط الدخول الثلاث */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">🎯 نقاط الدخول الثلاث الأوتوماتيكية</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.entry_points?.entry_points?.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      index === 0
                        ? 'bg-green-900 border-green-700'
                        : index === 1
                        ? 'bg-yellow-900 border-yellow-700'
                        : 'bg-red-900 border-red-700'
                    }`}
                  >
                    {/* Level Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">النقطة #{entry.level}</h4>
                      <span className="text-2xl">
                        {index === 0 ? '💚' : index === 1 ? '🟡' : '❤️'}
                      </span>
                    </div>

                    {/* Risk Level */}
                    <div className="mb-4 p-3 bg-black bg-opacity-50 rounded">
                      <p className="text-sm text-gray-300">مستوى الخطر</p>
                      <p className="text-xl font-bold">{entry.risk}</p>
                    </div>

                    {/* Entry Price */}
                    <div className="mb-4 p-3 bg-black bg-opacity-50 rounded">
                      <p className="text-sm text-gray-300">سعر الدخول</p>
                      <p className="text-2xl font-bold">${entry.price.toFixed(2)}</p>
                      <p className={`text-sm mt-1 ${entry.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.percentage >= 0 ? '+' : ''}{entry.percentage}% من السعر الحالي
                      </p>
                    </div>

                    {/* Targets */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-3 bg-green-900 bg-opacity-50 rounded">
                        <p className="text-xs text-gray-300">🎯 هدف الربح</p>
                        <p className="font-bold">${entry.profitTarget}</p>
                      </div>
                      <div className="p-3 bg-red-900 bg-opacity-50 rounded">
                        <p className="text-xs text-gray-300">🛑 حد الخسارة</p>
                        <p className="font-bold">${entry.stopLoss}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 italic border-t border-gray-700 pt-3">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictions */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">🔮 التنبؤات بالأسعار</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis.price_predictions || {}).map(([key, pred]) => (
                  <div key={key} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h4 className="font-bold mb-3">{key.replace('prediction_', 'التنبؤ خلال ')} ساعة</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">السعر المتوقع:</span>
                        <span className="font-bold">${pred.predicted_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">التغير:</span>
                        <span className={pred.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {pred.direction} {pred.change_percent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الثقة:</span>
                        <span>{pred.confidence}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends Analysis */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">📈 تحليل الاتجاهات</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis.trend_analysis || {}).map(([key, trend]) => (
                  <div key={key} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h4 className="font-bold mb-3">{key.replace('trend_', 'آخر ')} ساعة</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">الاتجاه</p>
                        <p className="text-2xl font-bold">{trend.direction}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">قوة الاتجاه</p>
                        <p className="font-bold">{trend.strength}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy/Sell Signals */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">🚀 إشارات الشراء والبيع</h3>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-900 bg-opacity-50 rounded">
                    <p className="text-gray-300 text-sm">إشارات الشراء</p>
                    <p className="text-3xl font-bold text-green-400">
                      {analysis.buy_sell_signals?.buy_strength}%
                    </p>
                  </div>
                  <div className="p-4 bg-red-900 bg-opacity-50 rounded">
                    <p className="text-gray-300 text-sm">إشارات البيع</p>
                    <p className="text-3xl font-bold text-red-400">
                      {analysis.buy_sell_signals?.sell_strength}%
                    </p>
                  </div>
                  <div className="p-4 bg-blue-900 bg-opacity-50 rounded col-span-2 md:col-span-2">
                    <p className="text-gray-300 text-sm mb-2">التوصية</p>
                    <p className="text-2xl font-bold">
                      {analysis.buy_sell_signals?.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Volatility */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">📊 تحليل التقلبات</h3>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">مستوى التقلب</p>
                    <p className="text-2xl font-bold">
                      {analysis.volatility?.volatility_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">الانحراف المعياري</p>
                    <p className="text-2xl font-bold">
                      ${analysis.volatility?.standard_deviation}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">متوسط السعر</p>
                    <p className="text-2xl font-bold">
                      ${analysis.volatility?.avg_price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">📋 الملخص</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>أفضل نقطة دخول:</span>
                  <span className="font-bold">${analysis.summary?.best_entry?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>تقييم السوق:</span>
                  <span className="font-bold">{analysis.summary?.market_sentiment}</span>
                </div>
                <div className="flex justify-between">
                  <span>مستوى المخاطرة:</span>
                  <span className="font-bold">{analysis.summary?.risk_level}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
