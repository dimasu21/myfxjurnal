import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchLiveMarketNews, 
  CURATED_MARKET_NEWS, 
  ForexNewsItem 
} from '../utils/newsService';
import { 
  ArrowLeft, 
  Newspaper, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  Search,
  Filter,
  Clock,
  LineChart,
  X,
  Compass,
  Flame,
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface RealtimeNewsViewProps {
  onBack: () => void;
  onOpenChart?: (pair: string) => void;
}

const CURRENCY_TAGS = [
  { id: 'ALL', label: 'Semua Instrumen' },
  { id: 'USD', label: 'USD (Dollar AS)' },
  { id: 'XAU', label: 'XAU (Emas Spot)' },
  { id: 'EUR', label: 'EUR (Euro)' },
  { id: 'GBP', label: 'GBP (Sterling)' },
  { id: 'JPY', label: 'JPY (Yen Jepang)' },
  { id: 'BTC', label: 'BTC (Bitcoin)' },
  { id: 'AUD', label: 'AUD (Aussie)' },
  { id: 'CAD', label: 'CAD (Loonie)' },
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
  // State berita
  const [news, setNews] = useState<ForexNewsItem[]>(CURATED_MARKET_NEWS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [selectedSentiment, setSelectedSentiment] = useState<'ALL' | 'Bullish' | 'Bearish' | 'Netral'>('ALL');

  // Load Berita Awal & Auto-Refresh per 60 detik
  useEffect(() => {
    loadLiveNews();
    const interval = setInterval(() => {
      loadLiveNews();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const loadLiveNews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveMarketNews();
      if (data && data.length > 0) {
        setNews(data);
      }
    } catch (e) {
      console.warn('Gagal memperbarui berita:', e);
    } finally {
      setIsLoading(false);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    }
  };

  // Filter Berita Cerdas
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // 1. Filter Mata Uang / Instrumen
      if (selectedCurrency !== 'ALL' && item.currency !== selectedCurrency) {
        return false;
      }

      // 2. Filter Kategori
      if (selectedCategory !== 'Semua Kategori' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Filter Sentimen
      if (selectedSentiment !== 'ALL' && item.sentiment !== selectedSentiment) {
        return false;
      }

      // 4. Pencarian Teks Bebas
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchSource = item.source.toLowerCase().includes(q);
        const matchCurrency = item.currency.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchSource && !matchCurrency && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [news, selectedCurrency, selectedCategory, selectedSentiment, searchQuery]);

  // Barometer Sentimen Pasar dari berita yang tampil
  const sentimentStats = useMemo(() => {
    let bull = 0;
    let bear = 0;
    let net = 0;
    const total = filteredNews.length || 1;

    filteredNews.forEach((n) => {
      if (n.sentiment === 'Bullish') bull++;
      else if (n.sentiment === 'Bearish') bear++;
      else net++;
    });

    return {
      bullCount: bull,
      bearCount: bear,
      netCount: net,
      bullPct: Math.round((bull / total) * 100),
      bearPct: Math.round((bear / total) * 100),
      netPct: Math.round((net / total) * 100),
    };
  }, [filteredNews]);

  // Berita Utama (Hero Headline)
  const featuredItem = useMemo(() => {
    if (selectedCurrency === 'ALL' && !searchQuery.trim()) {
      return filteredNews.find((n) => n.currency === 'XAU' || n.isFeatured) || filteredNews[0];
    }
    return null;
  }, [filteredNews, selectedCurrency, searchQuery]);

  // Sisa berita non-hero
  const displayFeed = useMemo(() => {
    if (featuredItem && selectedCurrency === 'ALL' && !searchQuery.trim()) {
      return filteredNews.filter((n) => n.id !== featuredItem.id);
    }
    return filteredNews;
  }, [filteredNews, featuredItem, selectedCurrency, searchQuery]);

  // Map Badge Warna Mata Uang
  const getCurrencyBadgeStyle = (curr: string) => {
    switch (curr) {
      case 'XAU':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'USD':
        return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'EUR':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'GBP':
        return 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'JPY':
        return 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'BTC':
        return 'bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
    }
  };

  // Navigasi ke Chart Pair yang relevan
  const handleJumpToChart = (curr: string) => {
    if (!onOpenChart) return;
    const pairMap: Record<string, string> = {
      XAU: 'XAU/USD',
      USD: 'EUR/USD',
      EUR: 'EUR/USD',
      GBP: 'GBP/USD',
      JPY: 'USD/JPY',
      AUD: 'AUD/USD',
      CAD: 'USD/CAD',
      BTC: 'BTC/USD',
    };
    const targetPair = pairMap[curr] || 'EUR/USD';
    onOpenChart(targetPair);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7f9] dark:bg-[#0b1120] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* ============================================================ */}
      {/* TOP BAR HEADER (BERSIH & PROFESIONAL) */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Kembali ke Lembar Kerja (Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#107c41] dark:text-emerald-400">
                <Newspaper className="w-4 h-4" />
              </div>
              <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Warta Pasar & Berita Forex
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                <Globe className="w-3 h-3 text-emerald-600" />
                Agregator Global
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 hidden sm:block">
              Analisis fundamental, sentimen suku bunga bank sentral & pergerakan komoditas
            </p>
          </div>
        </div>

        {/* Sync Status & Refresh Button */}
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 hidden sm:inline">
              Update: {lastUpdated}
            </span>
          )}
          <button
            onClick={loadLiveNews}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#107c41] hover:bg-[#0e6b37] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            title="Segarkan feed berita pasar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Memperbarui...' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTAINER */}
      {/* ============================================================ */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-8 space-y-5">
        
        {/* ============================================================ */}
        {/* BAROMETER SENTIMEN PASAR (INTERACTIVE MARKET BIAS) */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#107c41] dark:text-emerald-400" />
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Barometer Sentimen Berita Pasar ({filteredNews.length} Analisis)
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> Bullish: {sentimentStats.bullPct}%
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                <TrendingDown className="w-3.5 h-3.5" /> Bearish: {sentimentStats.bearPct}%
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400 font-semibold">
                <Minus className="w-3.5 h-3.5" /> Netral: {sentimentStats.netPct}%
              </span>
            </div>
          </div>

          {/* Progress Bar Sentimen Komposit */}
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden flex">
            <div 
              style={{ width: `${sentimentStats.bullPct}%` }} 
              className="bg-emerald-500 transition-all duration-500" 
              title={`Bullish ${sentimentStats.bullPct}%`}
            />
            <div 
              style={{ width: `${sentimentStats.bearPct}%` }} 
              className="bg-rose-500 transition-all duration-500" 
              title={`Bearish ${sentimentStats.bearPct}%`}
            />
            <div 
              style={{ width: `${sentimentStats.netPct}%` }} 
              className="bg-slate-300 dark:bg-slate-600 transition-all duration-500" 
              title={`Netral ${sentimentStats.netPct}%`}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* PENCARIAN & FILTER MULTI-DIMENSI */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
          {/* Search Box Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari isu berita makro, The Fed, CPI, Emas, Suku Bunga, atau institusi..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#107c41]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills Mata Uang / Pasangan */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">
              Instrumen:
            </span>
            {CURRENCY_TAGS.map((curr) => (
              <button
                key={curr.id}
                onClick={() => setSelectedCurrency(curr.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCurrency === curr.id
                    ? 'bg-[#107c41] text-white shadow-xs font-bold'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {curr.label}
              </button>
            ))}
          </div>

          {/* Sub Filter: Kategori & Sentimen */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                Kategori:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                Sentimen:
              </span>
              {(['ALL', 'Bullish', 'Bearish', 'Netral'] as const).map((sent) => (
                <button
                  key={sent}
                  onClick={() => setSelectedSentiment(sent)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedSentiment === sent
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  {sent === 'ALL' ? 'Semua' : sent}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter Hasil Pencarian */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 px-1">
          <span>
            Menampilkan <strong>{filteredNews.length}</strong> warta berita pasar
          </span>
          {(searchQuery || selectedCurrency !== 'ALL' || selectedCategory !== 'Semua Kategori' || selectedSentiment !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCurrency('ALL');
                setSelectedCategory('Semua Kategori');
                setSelectedSentiment('ALL');
              }}
              className="text-[#107c41] dark:text-emerald-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* HERO FEATURED STORY (BREAKING MARKET HEADLINE) */}
        {/* ============================================================ */}
        {featuredItem && (
          <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 dark:from-[#111827] dark:via-[#111827] dark:to-emerald-950/20 rounded-xl p-5 sm:p-6 border border-emerald-300 dark:border-emerald-800/80 shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#107c41] text-white shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  Sorotan Utama Pasar
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getCurrencyBadgeStyle(featuredItem.currency)}`}>
                  {featuredItem.currency}/USD
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                  {featuredItem.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{featuredItem.publishedAt}</span>
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-white leading-snug">
                {featuredItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                {featuredItem.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Sumber:</span>
                <strong className="text-gray-900 dark:text-white font-semibold">{featuredItem.source}</strong>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] ${
                  featuredItem.sentiment === 'Bullish'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : featuredItem.sentiment === 'Bearish'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                }`}>
                  {featuredItem.sentiment === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                  {featuredItem.sentiment === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                  {featuredItem.sentiment === 'Netral' && <Minus className="w-3 h-3" />}
                  <span>Sentimen {featuredItem.sentiment}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenChart && (
                  <button
                    onClick={() => handleJumpToChart(featuredItem.currency)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <LineChart className="w-3.5 h-3.5 text-[#107c41]" />
                    <span>Lihat Chart {featuredItem.currency}</span>
                  </button>
                )}

                {featuredItem.url && (
                  <a
                    href={featuredItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#107c41] hover:bg-[#0e6b37] text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <span>Baca Laporan Asli</span>
                    <ExternalLink className="w-3 h-3 text-emerald-100" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* GRID DAFTAR WARTA BERITA PASAR */}
        {/* ============================================================ */}
        {displayFeed.length === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-xl p-10 text-center border border-gray-200 dark:border-slate-800 space-y-3">
            <Newspaper className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300">
              Tidak Ada Berita yang Sesuai
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              Tidak ditemukan artikel berita untuk kata kunci atau kombinasi filter yang Anda pilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCurrency('ALL');
                setSelectedCategory('Semua Kategori');
                setSelectedSentiment('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-[#107c41] text-white text-xs font-semibold hover:bg-[#0e6b37] transition-colors cursor-pointer"
            >
              Tampilkan Semua Berita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayFeed.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-[#111827] rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-xs hover:border-[#107c41]/50 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Meta Tag Header */}
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${getCurrencyBadgeStyle(item.currency)}`}>
                        {item.currency}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                        {item.category}
                      </span>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                        item.sentiment === 'Bullish' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : item.sentiment === 'Bearish' 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : 'text-gray-400 dark:text-slate-500'
                      }`}>
                        {item.sentiment === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                        {item.sentiment === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                        {item.sentiment === 'Netral' && <Minus className="w-3 h-3" />}
                        <span>{item.sentiment}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 dark:text-slate-500 text-[11px] shrink-0 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{item.publishedAt}</span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 hover:text-[#107c41] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800/80 text-[11px] text-gray-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>Sumber:</span>
                    <strong className="text-gray-700 dark:text-slate-300 font-semibold">{item.source}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenChart && item.currency !== 'GLOBAL' && (
                      <button
                        type="button"
                        onClick={() => handleJumpToChart(item.currency)}
                        className="text-gray-500 dark:text-slate-400 hover:text-[#107c41] dark:hover:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer"
                        title={`Buka live chart ${item.currency}`}
                      >
                        <LineChart className="w-3 h-3" />
                        <span>Chart</span>
                      </button>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#107c41] dark:text-emerald-400 hover:underline font-bold flex items-center gap-0.5"
                      >
                        <span>Baca</span>
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
