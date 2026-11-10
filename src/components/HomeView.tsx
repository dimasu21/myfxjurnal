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
  TrendingDown, 
  Newspaper, 
  User, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowRight,
  ExternalLink,
  Flame,
  Radio,
  Layers
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
  onOpenNewTrade,
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
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Top Banner / Ticker Info */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-2.5">
          <img src="/fx-logo.png" alt="Fx" className="h-7 w-auto object-contain" />
          <div>
            <h1 className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight">
              Dashboard Trader Portfolio
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">
              Overview performa & status akun MetaTrader {user.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-200 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{user.username}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-10 space-y-6">

        {/* 1. MYFXBOOK MACRO PORTFOLIO BANNER */}
        <div className="bg-gradient-to-br from-[#0c4023] via-[#09321c] to-[#062213] text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-800/40 relative overflow-hidden space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {user.accountType || 'Real'} Account
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  Broker: <strong>{user.broker || 'MetaTrader 5'}</strong>
                </span>
                <span className="text-emerald-400">•</span>
                <span className="text-xs text-emerald-200 font-mono">
                  Leverage: {user.leverage || '1:500'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-1">
                ${currentEstBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-sans font-normal text-emerald-300/80 ml-2">Estimated Balance</span>
              </h2>
            </div>

            {/* Quick Action Button: Masuk ke Jurnal */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('sheet')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Jurnal Trading</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6-KPI Metric Grid Ala Myfxbook */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Gain / Return</span>
              <span className={`text-base sm:text-lg font-black font-mono block mt-1 ${Number(totalGainPercent) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Number(totalGainPercent) >= 0 ? `+${totalGainPercent}%` : `${totalGainPercent}%`}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Net Profit</span>
              <span className={`text-base sm:text-lg font-black font-mono block mt-1 ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Total Pips</span>
              <span className={`text-base sm:text-lg font-black font-mono block mt-1 ${stats.totalPips >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Win Rate</span>
              <span className="text-base sm:text-lg font-black font-mono text-white block mt-1">
                {stats.winRate}%
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Profit Factor</span>
              <span className="text-base sm:text-lg font-black font-mono text-white block mt-1">
                {stats.profitFactor}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 uppercase font-semibold block">Total Trades</span>
              <span className="text-base sm:text-lg font-black font-mono text-white block mt-1">
                {stats.totalTrades} ({stats.winTrades}W/{stats.lossTrades}L)
              </span>
            </div>
          </div>
        </div>

        {/* 2. DUA KOLOM: Mini Equity Growth Chart + Fitur Menu Cepat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri (2 Span): Mini Equity Curve */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Kurva Pertumbuhan Akumulasi Pips</span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Performa equity curve berdasarkan riwayat entri tersimpan
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Analisis Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val: any) => [`${val} Pips`, 'Akumulasi']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pips"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#equityGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kolom Kanan (1 Span): Navigasi Fitur Cepat */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              Alat & Menu Cepat
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => onNavigate('calendar')}
                className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Kalender Berita Ekonomi</strong>
                    <span className="text-[10px] text-gray-400">Jadwal CPI, NFP, Suku Bunga</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('news')}
                className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Berita Forex Real-Time</strong>
                    <span className="text-[10px] text-gray-400">Live feed pasar & sentimen</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('chart')}
                className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Live Candlestick Chart</strong>
                    <span className="text-[10px] text-gray-400">TradingView multi-timeframe</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onNavigate('lot-calc')}
                className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between border border-gray-100 dark:border-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <strong className="block text-gray-900 dark:text-white">Kalkulator Ukuran Lot</strong>
                    <span className="text-[10px] text-gray-400">Manajemen risiko presisi</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SECTION: LIVE FOREX BREAKING NEWS STREAM */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Headline Berita Pasar Terkini (Real-Time Feed)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {latestNews.map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigate('news')}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">
                    {n.currency}
                  </span>
                  <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{n.publishedAt}</span>
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {n.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>Sumber: {n.source}</span>
                  <span className="text-emerald-600 font-semibold">Live Feed</span>
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
