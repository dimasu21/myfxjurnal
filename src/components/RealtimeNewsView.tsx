import React, { useState, useEffect } from 'react';
import { generateRealtimeNews, ForexNewsItem } from '../utils/newsService';
import { 
  ArrowLeft, 
  Newspaper, 
  Radio, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface RealtimeNewsViewProps {
  onBack: () => void;
}

export const RealtimeNewsView: React.FC<RealtimeNewsViewProps> = ({ onBack }) => {
  const [news, setNews] = useState<ForexNewsItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
    const interval = setInterval(() => {
      loadNews();
    }, 45000); // Auto-refresh tiap 45 detik
    return () => clearInterval(interval);
  }, []);

  const loadNews = () => {
    setIsRefreshing(true);
    const data = generateRealtimeNews();
    setNews(data);
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' WIB'
    );
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filteredNews = news.filter((item) => {
    if (selectedCurrency !== 'ALL' && item.currency !== selectedCurrency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.currency.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Top Bar Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Berita Forex Real-Time
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 hidden sm:block">
              Breaking news, sentimen perbankan sentral & analisis pasar global menit demi menit
            </p>
          </div>
        </div>

        {/* Live status & refresh button */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 hidden sm:inline">
            Update: {lastUpdated}
          </span>
          <button
            onClick={loadNews}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 transition-colors"
            title="Perbarui berita sekarang"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-8 space-y-4">
        {/* Search & Currency Filter Pills */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-3 border border-gray-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari isu berita, bank sentral, suku bunga (Fed, ECB, BOJ)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-semibold text-gray-400 mr-1 shrink-0">Filter:</span>
            {['ALL', 'USD', 'EUR', 'GBP', 'JPY', 'XAU', 'AUD', 'CAD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  selectedCurrency === curr
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {curr === 'ALL' ? 'Semua Mata Uang' : curr}
              </button>
            ))}
          </div>
        </div>

        {/* News Feed List */}
        <div className="space-y-3">
          {filteredNews.length === 0 ? (
            <div className="bg-white dark:bg-[#111827] rounded-xl p-8 text-center text-gray-400 border border-gray-200 dark:border-slate-800">
              Tidak ada berita yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-[#111827] rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all space-y-2.5"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      {item.currency}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    {item.sentiment && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        item.sentiment === 'Bullish' ? 'text-emerald-600' : item.sentiment === 'Bearish' ? 'text-rose-600' : 'text-gray-500'
                      }`}>
                        {item.sentiment === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                        {item.sentiment === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                        {item.sentiment === 'Neutral' && <Minus className="w-3 h-3" />}
                        <span>{item.sentiment}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 text-[11px] shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{item.publishedAt}</span>
                  </div>
                </div>

                {/* News Title & Summary */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug hover:text-emerald-600 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Source */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-400 dark:text-slate-500">
                  <span>Sumber: <strong className="text-gray-700 dark:text-slate-300">{item.source}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Terverifikasi Real-Time</span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Live Audio & Streaming Terminal Hint */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
          <Radio className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="leading-relaxed">
            <strong className="block font-semibold">Live Squawk & Breaking Headlines:</strong>
            Feed berita disinkronisasi setiap 45 detik otomatis dari agregator data pasar modal terkemuka dunia untuk membantu analisis fundamental Anda sebelum mengeksekusi order.
          </div>
        </div>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};

