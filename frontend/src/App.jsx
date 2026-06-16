/**
 * التطبيق الرئيسي - MiM Crypto Analytics
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AnalysisPage from './pages/AnalysisPage';
import ComparePage from './pages/ComparePage';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
        {/* Navigation */}
        <nav className="bg-gray-900 bg-opacity-95 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  MiM
                </div>
                <div className="hidden md:block">
                  <p className="text-lg font-bold text-white">MiM Crypto</p>
                  <p className="text-xs text-gray-400">محلل العملات الذكي</p>
                </div>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition font-semibold flex items-center gap-2"
                >
                  🔍 البحث
                </Link>
                <Link
                  to="/analysis"
                  className="text-gray-300 hover:text-blue-400 transition font-semibold flex items-center gap-2"
                >
                  📊 التحليل
                </Link>
                <Link
                  to="/compare"
                  className="text-gray-300 hover:text-blue-400 transition font-semibold flex items-center gap-2"
                >
                  ⚖️ المقارنة
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white text-2xl"
              >
                ☰
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 flex flex-col gap-3 pb-4">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-blue-400 transition font-semibold px-4 py-2 rounded hover:bg-gray-800"
                >
                  🔍 البحث
                </Link>
                <Link
                  to="/analysis"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-blue-400 transition font-semibold px-4 py-2 rounded hover:bg-gray-800"
                >
                  📊 ��لتحليل
                </Link>
                <Link
                  to="/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-blue-400 transition font-semibold px-4 py-2 rounded hover:bg-gray-800"
                >
                  ⚖️ المقارنة
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* About */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">عن MiM</h3>
                <p className="text-gray-400">
                  منصة تحليل العملات الرقمية الذكية التي توفر نقاط دخول أوتوماتيكية وتنبؤات دقيقة.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">المميزات</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>✅ تحليل فني متقدم</li>
                  <li>✅ نقاط دخول ذكية</li>
                  <li>✅ تنبؤات بالأسعار</li>
                  <li>✅ مقارنة العملات</li>
                </ul>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">معلومات</h3>
                <p className="text-gray-400 mb-4">
                  البيانات من Binance و CoinGecko • تحديث فوري
                </p>
                <p className="text-gray-500 text-sm">
                  ⚠️ تذكير: هذا التطبيق لأغراض تعليمية فقط. استثمر بحكمة.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 text-center text-gray-500">
              <p>© 2026 MiM Crypto Analytics. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
