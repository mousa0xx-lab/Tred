/**
 * صفحة البحث - Search Page
 * البحث عن العملات وعرض المفضلة والمقارنة
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularCoins, setPopularCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // search, popular

  // البحث عن عملة
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/search', {
        params: {
          action: 'search',
          q: searchTerm,
        },
      });
      setSearchResults(response.data.results || []);
      setActiveTab('search');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // جلب العملات الشهيرة
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await axios.get('/api/search', {
          params: { action: 'popular' },
        });
        setPopularCoins(response.data.results || []);
      } catch (error) {
        console.error('Popular coins error:', error);
      }
    };

    fetchPopular();
  }, []);

  // إضافة/إزالة عملة من التحديد
  const toggleCoinSelection = (coin) => {
    const isSelected = selectedCoins.some((c) => c.id === coin.id);
    if (isSelected) {
      setSelectedCoins(selectedCoins.filter((c) => c.id !== coin.id));
    } else {
      if (selectedCoins.length < 5) {
        setSelectedCoins([...selectedCoins, coin]);
      }
    }
  };

  // عرض تفاصيل العملة
  const CoinCard = ({ coin, isSelected, onSelect }) => (
    <div
      onClick={() => onSelect(coin)}
      className={`p-4 rounded-lg cursor-pointer transition transform hover:scale-105 ${
        isSelected
          ? 'bg-blue-600 text-white border-2 border-blue-700'
          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        {coin.image && (
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-xs px-2 py-1 bg-gray-700 rounded">
          #{coin.market_cap_rank || 'N/A'}
        </span>
      </div>

      <h3 className="font-bold text-lg">{coin.name}</h3>
      <p className="text-sm text-gray-300">{coin.symbol}</p>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between">
          <span className="text-xs">السعر:</span>
          <span className="font-semibold">${coin.current_price?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs">التغير 24س:</span>
          <span
            className={coin.price_change_percent_24h >= 0 ? 'text-green-400' : 'text-red-400'}
          >
            {coin.price_change_percent_24h?.toFixed(2) || 'N/A'}%
          </span>
        </div>
        {coin.market_cap && (
          <div className="flex justify-between">
            <span className="text-xs">رسملة السوق:</span>
            <span className="text-xs">
              ${(coin.market_cap / 1e9).toFixed(2)}B
            </span>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-3 text-center text-sm font-semibold">✓ مختار</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔍 محرك البحث</h1>
          <p className="text-gray-400">ابحث عن أي عملة وقارنها مع عملات أخرى</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن عملة (Bitcoin, Ethereum, BTC, ETH...)"
              className="w-full px-6 py-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition"
            >
              بحث
            </button>
          </div>
        </form>

        {/* Selected Coins */}
        {selectedCoins.length > 0 && (
          <div className="mb-8 p-6 bg-blue-900 rounded-lg">
            <h3 className="font-bold mb-4">
              العملات المختارة: {selectedCoins.length}/5
            </h3>
            <div className="flex flex-wrap gap-3">
              {selectedCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded-lg"
                >
                  {coin.image && (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{coin.symbol}</span>
                  <button
                    onClick={() => toggleCoinSelection(coin)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {selectedCoins.length >= 2 && (
              <button
                onClick={() => {
                  const ids = selectedCoins.map((c) => c.id).join(',');
                  window.location.href = `/compare?coins=${ids}`;
                }}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 px-6 py-3 rounded-lg font-semibold transition"
              >
                قارن العملات المختارة 📊
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('search');
              setSearchResults(searchResults);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            نتائج البحث
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'popular'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            العملات الشهيرة
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">جاري البحث...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeTab === 'search'
              ? searchResults.map((coin) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    isSelected={selectedCoins.some((c) => c.id === coin.id)}
                    onSelect={toggleCoinSelection}
                  />
                ))
              : popularCoins.map((coin) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    isSelected={selectedCoins.some((c) => c.id === coin.id)}
                    onSelect={toggleCoinSelection}
                  />
                ))}
          </div>
        )}

        {/* No Results */}
        {!loading && activeTab === 'search' && searchResults.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">لم يتم العثور على نتائج</p>
            <p className="text-gray-500">جرب البحث عن عملة أخرى</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
