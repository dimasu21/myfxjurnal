import React, { useMemo } from 'react';
import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { generateRealtimeNews } from '../utils/newsService';
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Calculator, 
  TrendingUp, 
  Newspaper, 
  Clock, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SiteFooter } from './SiteFooter';

interface HomeViewProps {
  user: UserAccount;
  trades: Trade[];
  onNavigate: (view: any) => void;
  onOpenNewTrade: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  trades,
  onNavigate,
}) => {
  // Hitung metrik performa portofolio akun ala Myfxbook
  const stats = useMemo(() => calculateStats(trades), [trades]);

  // Data kumulatif Pips untuk grafik Equity Myfxbook
  const equityData = useMemo(() => {
    let cumulative = 0;
    if (trades.length === 0) {
      return [
        { name: 'Start', pips: 0 },
        { name: 'Target', pips: 0 },
      ];
    }
    return trades.map((t, idx) => {
      cumulative += Number(t.pips) || 0;
      return {
        name: `T${idx + 1}`,
        pips: cumulative,
      };
    });
  }, [trades]);

  // Cuplikan berita real-time
  const latestNews = useMemo(() => generateRealtimeNews().slice(0, 4), []);

  // Total gain estimasi berdasarkan initialBalance
  const initialBal = user.initialBalance || 1000;
  const currentEstBalance = initialBal + stats.totalPnL;
  const totalGainPercent = initialBal > 0 ? ((stats.totalPnL / initialBal) * 100).toFixed(2) : '0.00';

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7f9] dark:bg-[#0f172a] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-10 space-y-5">

        {/* 1. MYFXBOOK ACCOUNT PORTFOLIO CARD (Clean, Professional, Non-Norak) */}
        <div className="bg-white dark:bg-[#1a2232] border border-gray-200 dark:border-slate-800 rounded p-4 sm:p-5 shadow-xs space-y-4">
          {/* Top Bar: Saldo & Info Akun */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 font-medium">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[11px]">
                  {user.accountType || 'Real'}
                </span>
                <span>•</span>
                <span>{user.broker || 'MetaTrader 5'}</span>
                <span>•</span>
                <span>Leverage {user.leverage || '1:500'}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-mono text-gray-900 dark:text-white tracking-tight">
                  ${currentEstBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-sans">
                  Estimated Balance
                </span>
              </div>
            </div>

            {/* Tombol Masuk ke Jurnal */}
            <button
              onClick={() => onNavigate('sheet')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e66a00] hover:bg-[#cf5f00] text-white font-bold text-xs sm:text-sm rounded transition-colors shadow-xs cursor-pointer active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Jurnal Trading</span>
            </button>
          </div>

          {/* 6-KPI Metric Grid Ala Myfxbook */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Gain / Return</span>
              <span className={`text-base font-bold font-mono block mt-0.5 ${Number(totalGainPercent) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {Number(totalGainPercent) >= 0 ? `+${totalGainPercent}%` : `${totalGainPercent}%`}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Net Profit</span>
              <span className={`text-base font-bold font-mono block mt-0.5 ${stats.totalPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Total Pips</span>
              <span className={`text-base font-bold font-mono block mt-0.5 ${stats.totalPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Win Rate</span>
              <span className="text-base font-bold font-mono text-gray-900 dark:text-white block mt-0.5">
                {stats.winRate}%
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Profit Factor</span>
              <span className="text-base font-bold font-mono text-gray-900 dark:text-white block mt-0.5">
                {stats.profitFactor}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/60 rounded p-2.5">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold block">Total Trades</span>
              <span className="text-base font-bold font-mono text-gray-900 dark:text-white block mt-0.5">
                {stats.totalTrades} <span className="text-xs font-normal text-gray-500">({stats.winTrades}W/{stats.lossTrades}L)</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. DUA KOLOM: Equity Growth Chart + Fitur Menu Cepat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Kolom Kiri (2 Span): Equity Curve */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a2232] rounded border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Kurva Pertumbuhan Akumulasi Pips</span>
                </h3>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Analisis Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-[200px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val: any) => [`${val} Pips`, 'Akumulasi']}
                    contentStyle={{ borderRadius: '6px', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pips"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#equityGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kolom Kanan (1 Span): Navigasi Fitur Cepat */}
          <div className="bg-white dark:bg-[#1a2232] rounded border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              Alat & Menu Cepat
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => onNavigate('calendar')}
                className="p-2.5 rounded hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Kalender Berita Ekonomi</strong>
                    <span className="text-[10px] text-gray-500">Jadwal CPI, NFP, Suku Bunga</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('news')}
                className="p-2.5 rounded hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Berita Forex Real-Time</strong>
                    <span className="text-[10px] text-gray-500">Live feed pasar & sentimen</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('chart')}
                className="p-2.5 rounded hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Live Candlestick Chart</strong>
                    <span className="text-[10px] text-gray-500">TradingView multi-timeframe</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('lot-calc')}
                className="p-2.5 rounded hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Kalkulator Ukuran Lot</strong>
                    <span className="text-[10px] text-gray-500">Manajemen risiko presisi</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SECTION: LIVE FOREX BREAKING NEWS STREAM */}
        <div className="bg-white dark:bg-[#1a2232] rounded border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Headline Berita Pasar Terkini (Real-Time Feed)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {latestNews.map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigate('news')}
                className="p-3 rounded bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 hover:border-emerald-500/50 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700">
                    {n.currency}
                  </span>
                  <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>{n.publishedAt}</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {n.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                  <span>Sumber: {n.source}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
