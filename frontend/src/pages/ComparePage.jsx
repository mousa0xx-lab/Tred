/**
 * صفحة المقارنة - Compare Coins Page
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ComparePage = () => {
  const [coins, setCoins] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chartType, setChartType] = useState('price');

  const urlParams = new URLSearchParams(window.location.search);
  const initialCoins = urlParams.get('coins') ? urlParams.get('coins').split(',') : [];

  useEffect(() => {
    if (initialCoins.length > 0) {
      setCoins(initialCoins);
    }
  }, []);

  // جلب بيانات المقارنة
  useEffect(() => {
    if (coins.length > 0) {
      fetchComparison();
    }
  }, [coins]);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/search', {
        params: {
          action: 'compare',
          ids: coins.join(','),
        },
      });
      setComparison(response.data);
    } catch (err) {
      setError(err.message || 'فشل المقارنة');
    } finally {
      setLoading(false);
    }
  };

  // البحث عن عملة
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get('/api/search', {
        params: {
          action: 'search',
          q: searchTerm,
        },
      });
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // إضافة عملة للمقارنة
  const addCoin = (coinId) => {
    if (!coins.includes(coinId) && coins.length < 5) {
      setCoins([...coins, coinId]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // إزالة عملة من المقارنة
  const removeCoin = (coinId) => {
    setCoins(coins.filter((c) => c !== coinId));
  };

  // تحضير بيانات الرسم البياني
  const prepareChartData = () => {
    if (!comparison || !comparison.data) return [];
    
    return comparison.data.map((coin) => ({
      name: coin.id.toUpperCase(),
      price: coin.price,
      market_cap: coin.market_cap / 1e9,
      volume: coin.volume_24h / 1e6,
      change: coin.change_24h,
    }));
  };

  if (loading && coins.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">جاري المقارنة...</p>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            📊 قارن العملات
          </h1>
          <p className="text-gray-400">قارن أداء عملات متعددة جنباً إلى جنب مع رسوم بيانية تفاعلية</p>
        </div>

        {/* Search and Add Coins */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن عملة لإضافتها للمقارنة..."
                className="w-full px-6 py-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-2 rounded font-semibold transition"
              >
                بحث
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-sm text-gray-400 mb-3">اختر عملة لإضافتها:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {searchResults.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => addCoin(coin.id)}
                    disabled={coins.includes(coin.id)}
                    className={`p-3 rounded-lg text-center transition ${
                      coins.includes(coin.id)
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                    }`}
                  >
                    <div className="font-semibold text-sm">{coin.name}</div>
                    <div className="text-xs text-gray-200">{coin.symbol}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Coins */}
          <div className="p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg border border-blue-700">
            <h3 className="font-bold mb-3">العملات المختارة: {coins.length}/5</h3>
            {coins.length === 0 ? (
              <p className="text-gray-300">لم تختر أي عملات بعد. ابدأ بالبحث والإضافة!</p>
            ) : (
              <div className="space-y-2">
                {coins.map((coinId) => (
                  <div
                    key={coinId}
                    className="flex justify-between items-center bg-blue-800 px-4 py-2 rounded border border-blue-700"
                  >
                    <span className="font-semibold">{coinId}</span>
                    <button
                      onClick={() => removeCoin(coinId)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                    >
                      ✕ إزالة
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8">
            <p className="text-red-200">❌ خطأ: {error}</p>
          </div>
        )}

        {/* Comparison Results */}
        {comparison && comparison.data && comparison.data.length > 0 && (
          <>
            {/* Chart Types */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setChartType('price')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  chartType === 'price'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🏷️ الأسعار
              </button>
              <button
                onClick={() => setChartType('market_cap')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  chartType === 'market_cap'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                📈 رسملة السوق
              </button>
              <button
                onClick={() => setChartType('volume')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  chartType === 'volume'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                📊 الحجم
              </button>
              <button
                onClick={() => setChartType('change')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  chartType === 'change'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                📉 التغير
              </button>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }}
                      formatter={(value) => value.toFixed(2)}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey={chartType} 
                      fill="#06b6d4" 
                      name={chartType === 'price' ? 'السعر' : chartType === 'market_cap' ? 'رسملة السوق' : chartType === 'volume' ? 'الحجم' : 'التغير'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Comparison Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 font-bold">العملة</th>
                    <th className="text-right py-4 px-4 font-bold">السعر</th>
                    <th className="text-right py-4 px-4 font-bold">رسملة السوق</th>
                    <th className="text-right py-4 px-4 font-bold">الحجم (24س)</th>
                    <th className="text-right py-4 px-4 font-bold">التغير (24س)</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.data.map((coin) => (
                    <tr
                      key={coin.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="py-4 px-4 font-semibold text-blue-400">{coin.id.toUpperCase()}</td>
                      <td className="text-right py-4 px-4">💵 ${coin.price?.toFixed(2) || 'N/A'}</td>
                      <td className="text-right py-4 px-4">
                        💰 ${(coin.market_cap / 1e9)?.toFixed(2) || 'N/A'}B
                      </td>
                      <td className="text-right py-4 px-4">
                        📈 ${(coin.volume_24h / 1e6)?.toFixed(2) || 'N/A'}M
                      </td>
                      <td
                        className={`text-right py-4 px-4 font-bold ${
                          coin.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {coin.change_24h >= 0 ? '📈' : '📉'} {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h?.toFixed(2) || 'N/A'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparison.data.map((coin) => (
                <div 
                  key={coin.id} 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition"
                >
                  <h3 className="text-2xl font-bold mb-4 uppercase text-blue-400">{coin.id}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between pb-2 border-b border-gray-700">
                      <span className="text-gray-400">💵 السعر الحالي:</span>
                      <span className="font-bold text-cyan-400">${coin.price?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-700">
                      <span className="text-gray-400">💰 رسملة السوق:</span>
                      <span className="font-bold text-cyan-400">${(coin.market_cap / 1e9)?.toFixed(2)}B</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-700">
                      <span className="text-gray-400">📊 الحجم (24س):</span>
                      <span className="font-bold text-cyan-400">${(coin.volume_24h / 1e6)?.toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">📈 التغير (24س):</span>
                      <span
                        className={`font-bold ${
                          coin.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {coins.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">ابحث عن عملات لمقارنتها</p>
            <p className="text-gray-500 mt-2">يمكنك إضافة حتى 5 عملات للمقارنة والحصول على رسوم بيانية مفصلة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
