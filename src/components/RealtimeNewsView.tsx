import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchLiveMarketNews, 
  CURATED_MARKET_NEWS, 
  ForexNewsItem 
} from '../utils/newsService';
import { 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  X, 
  ExternalLink, 
  LineChart, 
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface RealtimeNewsViewProps {
  onBack: () => void;
  onOpenChart?: (pair: string) => void;
}

const INSTRUMENT_TABS = [
  { id: 'ALL', label: 'Semua' },
  { id: 'USD', label: 'USD' },
  { id: 'XAU', label: 'XAU' },
  { id: 'EUR', label: 'EUR' },
  { id: 'GBP', label: 'GBP' },
  { id: 'JPY', label: 'JPY' },
  { id: 'BTC', label: 'BTC' },
  { id: 'AUD', label: 'AUD' },
  { id: 'CAD', label: 'CAD' },
];

const CATEGORIES = [
  'Semua Kategori',
  'Bank Sentral',
  'Komoditas',
  'Ekonomi & CPI',
  'Geopolitik',
  'Teknikal',
];

export const RealtimeNewsView: React.FC<RealtimeNewsViewProps> = ({ 
  onBack, 
  onOpenChart 
}) => {
  const [news, setNews] = useState<ForexNewsItem[]>(CURATED_MARKET_NEWS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // State Filter
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [selectedSentiment, setSelectedSentiment] = useState<'ALL' | 'Bullish' | 'Bearish'>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expand row state untuk melihat summary detail
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveMarketNews();
      if (data && data.length > 0) {
        setNews(data);
      }
    } catch (e) {
      console.warn('Gagal memuat feed:', e);
    } finally {
      setIsLoading(false);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB'
      );
    }
  };

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (selectedCurrency !== 'ALL' && item.currency !== selectedCurrency) return false;
      if (selectedCategory !== 'Semua Kategori' && item.category !== selectedCategory) return false;
      if (selectedSentiment !== 'ALL' && item.sentiment !== selectedSentiment) return false;
      if (selectedImpact !== 'ALL' && item.impact !== selectedImpact) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = 
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.pair.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [news, selectedCurrency, selectedCategory, selectedSentiment, selectedImpact, searchQuery]);

  const hasActiveFilters = 
    selectedCurrency !== 'ALL' || 
    selectedCategory !== 'Semua Kategori' || 
    selectedSentiment !== 'ALL' || 
    selectedImpact !== 'ALL' || 
    Boolean(searchQuery.trim());

  const resetFilters = () => {
    setSelectedCurrency('ALL');
    setSelectedCategory('Semua Kategori');
    setSelectedSentiment('ALL');
    setSelectedImpact('ALL');
    setSearchQuery('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0f17] text-slate-200 overflow-y-auto font-sans select-text">
      
      {/* ============================================================ */}
      {/* 1. COMPACT TERMINAL HEADER (No bloated badge, No loud green) */}
      {/* ============================================================ */}
      <div className="bg-[#0e1420] border-b border-[#1e293b] px-4 py-2.5 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Kembali ke Sheet (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Market Wire
            </h1>
            <span className="text-slate-500 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Feed Makroekonomi & Berita Pasar Finansial
            </span>
          </div>
        </div>

        {/* Sync Status & Minimal Refresh */}
        <div className="flex items-center gap-2 text-xs">
          {lastUpdated && (
            <span className="font-mono text-slate-400 text-[11px] tabular-nums">
              Sync: {lastUpdated}
            </span>
          )}
          <button
            onClick={loadNews}
            disabled={isLoading}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Segarkan feed sekarang"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-slate-200' : ''}`} />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SINGLE INTEGRATED TOOLBAR (All controls in ONE unified bar) */}
      {/* ============================================================ */}
      <div className="bg-[#111726] border-b border-[#1e293b] px-4 sm:px-6 py-2 sticky top-[45px] z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Instrument Underline Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs font-mono">
            {INSTRUMENT_TABS.map((tab) => {
              const isActive = selectedCurrency === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCurrency(tab.id)}
                  className={`px-2.5 py-1 text-xs font-bold transition-all shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-emerald-500 text-white font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Toolbar Controls (Search + Dropdown Kategori + Sentiment Segmented) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari warta (Fed, CPI, Emas)..."
                className="w-40 sm:w-52 pl-8 pr-6 py-1 bg-[#090d16] border border-[#243048] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Kategori Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#090d16] border border-[#243048] text-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sentiment Segmented Control */}
            <div className="inline-flex rounded border border-[#243048] bg-[#090d16] p-0.5 text-xs font-mono">
              <button
                onClick={() => setSelectedSentiment('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  selectedSentiment === 'ALL'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedSentiment('Bullish')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-0.5 ${
                  selectedSentiment === 'Bullish'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
                title="Hanya sentimen Bullish"
              >
                <span className="text-emerald-400">▲</span>
                <span>Bull</span>
              </button>
              <button
                onClick={() => setSelectedSentiment('Bearish')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-0.5 ${
                  selectedSentiment === 'Bearish'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
                title="Hanya sentimen Bearish"
              >
                <span className="text-rose-400">▼</span>
                <span>Bear</span>
              </button>
            </div>

            {/* Active Filters Clear Button (inline) */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                title="Reset filter"
              >
                <X className="w-3 h-3 text-slate-400" />
                <span className="text-[11px]">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. DENSE SINGLE-COLUMN NEWS FEED (No cards, No blog slop) */}
      {/* ============================================================ */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        
        {/* Wire Header Meta Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-[#1e293b] pb-2 px-1">
          <span>Menampilkan <strong className="text-white">{filteredNews.length}</strong> warta pasar</span>
          <span className="text-slate-500 text-[11px]">Klik baris untuk melihat ringkasan pasar</span>
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2 border border-dashed border-[#1e293b] rounded">
            <p className="text-xs font-mono">Tidak ada berita yang cocok dengan kriteria filter.</p>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer font-mono"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="border border-[#1e293b] bg-[#0d1420] rounded divide-y divide-[#1e293b] overflow-hidden">
            {filteredNews.map((item) => {
              const isExpanded = expandedId === item.id;
              const isBull = item.sentiment === 'Bullish';
              const isBear = item.sentiment === 'Bearish';

              return (
                <div 
                  key={item.id}
                  className="hover:bg-[#131c2c] transition-colors"
                >
                  {/* MAIN ROW: Waktu | Indicator | Impact | Headline | Pair + % | Source */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-3 sm:px-4 sm:py-3 flex items-start sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    {/* Left: Indicator + Waktu */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Sentiment tiny directional marker */}
                      <span
                        className={`text-xs font-bold shrink-0 ${
                          isBull ? 'text-emerald-400' : isBear ? 'text-rose-400' : 'text-slate-500'
                        }`}
                        title={`Sentimen ${item.sentiment}`}
                      >
                        {isBull ? '▲' : isBear ? '▼' : '—'}
                      </span>

                      {/* Time (Mono Tabular) */}
                      <span className="font-mono text-xs text-slate-400 tabular-nums w-12 sm:w-16 shrink-0">
                        {item.publishedAt}
                      </span>

                      {/* Impact Level Badge (Traders Tool) */}
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                          item.impact === 'HIGH'
                            ? 'text-rose-400 bg-rose-950/70 border-rose-900/80'
                            : item.impact === 'MED'
                            ? 'text-amber-400 bg-amber-950/70 border-amber-900/80'
                            : 'text-slate-400 bg-slate-800/80 border-slate-700'
                        }`}
                        title={`Dampak Rilis: ${item.impact}`}
                      >
                        {item.impact}
                      </span>
                    </div>

                    {/* Middle: Headline */}
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs sm:text-sm text-slate-100 font-semibold group-hover:text-emerald-400 transition-colors line-clamp-1 leading-normal">
                        {item.title}
                      </p>
                    </div>

                    {/* Right: Pair & Live % Change + Source + Expand Arrow */}
                    <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                      {/* Pair Badge with Movement */}
                      {item.pair !== 'GLOBAL' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenChart) onOpenChart(item.pair);
                          }}
                          className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#182338] hover:bg-slate-700 text-slate-200 border border-[#243452] transition-colors cursor-pointer"
                          title={`Buka live chart ${item.pair}`}
                        >
                          <span className="font-bold text-[11px] text-white">{item.pair}</span>
                          <span className={`text-[10px] tabular-nums ${
                            item.pairChange.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {item.pairChange}
                          </span>
                        </button>
                      )}

                      {/* Source */}
                      <span className="text-[11px] text-slate-400 hidden md:inline">
                        {item.source}
                      </span>

                      {/* Toggle Expand Icon */}
                      <span className="text-slate-500 group-hover:text-slate-300">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>

                  {/* EXPANDABLE INLINE DETAIL (Opens cleanly without jarring modal) */}
                  {isExpanded && (
                    <div className="bg-[#090d16] px-4 py-3 sm:px-6 sm:py-3.5 border-t border-[#1e293b] space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-100">
                      <div className="flex items-center justify-between gap-3 text-slate-400 font-mono text-[11px] flex-wrap">
                        <div className="flex items-center gap-3">
                          <span>Waktu Rilis: <strong className="text-slate-200">{item.timeWIB}</strong></span>
                          <span>Kategori: <strong className="text-slate-200">{item.category}</strong></span>
                          <span>Sentimen: <strong className={isBull ? 'text-emerald-400' : isBear ? 'text-rose-400' : 'text-slate-300'}>{item.sentiment}</strong></span>
                        </div>
                        <span>Sumber: <strong className="text-slate-200">{item.source}</strong></span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-200 font-sans">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-end gap-3 pt-1 font-mono">
                        {item.pair !== 'GLOBAL' && onOpenChart && (
                          <button
                            type="button"
                            onClick={() => onOpenChart(item.pair)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#162134] hover:bg-slate-700 text-slate-200 border border-[#243452] transition-colors cursor-pointer text-xs"
                          >
                            <LineChart className="w-3 h-3 text-emerald-400" />
                            <span>Buka Live Chart {item.pair}</span>
                          </button>
                        )}

                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-xs"
                          >
                            <span>Baca Laporan Lengkap</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
