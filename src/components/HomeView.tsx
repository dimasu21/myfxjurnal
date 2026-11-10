import React, { useState, useMemo } from 'react';
import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { generateRealtimeNews } from '../utils/newsService';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Radio,
  SlidersHorizontal,
  Info,
  Sun,
  Moon,
  ChevronRight,
  Plus
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
  const [activeTab, setActiveTab] = useState<'my-account' | 'watchlist'>('my-account');

  // Perhitungan statistik portofolio
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

  const latestNews = useMemo(() => generateRealtimeNews().slice(0, 4), []);

  const initialBal = user.initialBalance || 1000;
  const currentEstBalance = initialBal + stats.totalPnL;
  const totalGainPercent = initialBal > 0 ? ((stats.totalPnL / initialBal) * 100).toFixed(2) : '0.00';

  // Sesi Pasar Jam Trading
  const marketSessions = [
    { name: 'New York', status: 'Buka', time: '13:00 - 22:00 UTC', isOpen: true, icon: Sun, flag: '🇺🇸' },
    { name: 'London', status: 'Buka', time: '08:00 - 17:00 UTC', isOpen: true, icon: Sun, flag: '🇬🇧' },
    { name: 'Tokyo', status: 'Tutup', time: '00:00 - 09:00 UTC', isOpen: false, icon: Moon, flag: '🇯🇵' },
    { name: 'Sydney', status: 'Tutup', time: '22:00 - 07:00 UTC', isOpen: false, icon: Moon, flag: '🇦🇺' },
  ];

  // Sistem Trading Populer untuk tabel 'Sistem terbaru' ala screenshot Myfxbook
  const sampleSystems = [
    {
      name: 'Zenex SG1 1000',
      author: 'wmbot',
      gain: '+70.62%',
      drawdown: '70.68%',
      monthly: '+5.83%',
      isPositive: true,
      sparkline: 'M0,15 Q20,18 40,8 T80,3 T100,2',
      color: '#10b981',
    },
    {
      name: 'Algorix AI',
      author: 'trademaster1789',
      gain: '+24.87%',
      drawdown: '6.06%',
      monthly: '+1.14%',
      isPositive: true,
      sparkline: 'M0,18 Q30,17 60,10 T100,4',
      color: '#10b981',
    },
    {
      name: 'Titan Gold Scalper',
      author: 'fxpro_id',
      gain: '+41.20%',
      drawdown: '11.45%',
      monthly: '+8.32%',
      isPositive: true,
      sparkline: 'M0,17 Q25,10 50,14 T100,5',
      color: '#10b981',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f0f3f6] dark:bg-[#0d121c] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Centered Main Container */}
      <div className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 pb-24 md:pb-10 space-y-6">

        {/* 2-Column Grid Layout Ala Myfxbook Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================ */}
          {/* KOLOM KIRI (LEBAR ~70%): Akun Saya & Sistem Terbaru */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. KOTAK 'AKUN SAYA' & 'DIPANTAU (0)' */}
            <div className="bg-white dark:bg-[#181f2b] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              
              {/* Tabs Bar Header */}
              <div className="bg-[#f8fafc] dark:bg-[#141a24] border-b border-gray-200 dark:border-slate-800 px-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('my-account')}
                    className={`px-4 py-2 text-xs font-bold transition-all rounded-t border-t-2 ${
                      activeTab === 'my-account'
                        ? 'bg-white dark:bg-[#181f2b] text-gray-900 dark:text-white border-t-[#e66a00] border-x border-gray-200 dark:border-slate-800 -mb-[1px]'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 border-t-transparent'
                    }`}
                  >
                    Akun saya
                  </button>
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`px-4 py-2 text-xs font-bold transition-all rounded-t border-t-2 ${
                      activeTab === 'watchlist'
                        ? 'bg-white dark:bg-[#181f2b] text-gray-900 dark:text-white border-t-[#e66a00] border-x border-gray-200 dark:border-slate-800 -mb-[1px]'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 border-t-transparent'
                    }`}
                  >
                    Dipantau (0)
                  </button>
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <button 
                    onClick={() => onNavigate('analytics')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors shadow-2xs"
                  >
                    <span>Bandingkan</span>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-5">
                {activeTab === 'watchlist' ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-xs flex items-center justify-center gap-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <span>Saat ini belum ada sistem yang Anda pantau.</span>
                  </div>
                ) : trades.length === 0 ? (
                  // Tampilan jika belum ada transaksi di jurnal
                  <div className="py-10 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Info className="w-4 h-4 text-[#e66a00]" />
                      <span>Saat ini Anda belum memiliki akun apa pun atau entri transaksi aktif.</span>
                    </div>

                    <div className="p-4 max-w-md mx-auto bg-gray-50 dark:bg-slate-800/40 rounded border border-gray-100 dark:border-slate-800 text-left space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Saldo Awal Akun:</span>
                        <strong className="font-mono">${initialBal.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Broker:</span>
                        <span>{user.broker || 'MetaTrader 5'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Leverage:</span>
                        <span>{user.leverage || '1:500'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('sheet')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e66a00] hover:bg-[#cf5f00] text-white font-bold rounded text-xs transition-colors shadow-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Buka Portofolio & Mulai Catat Jurnal</span>
                    </button>
                  </div>
                ) : (
                  // Tampilan jika sudah ada transaksi (Portofolio Ringkas Myfxbook)
                  <div className="space-y-5">
                    {/* Top Row: Balance & Action Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {user.accountType || 'Real'}
                          </span>
                          <span>•</span>
                          <span>{user.broker || 'MetaTrader 5'}</span>
                          <span>•</span>
                          <span>Leverage {user.leverage || '1:500'}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <h3 className="text-2xl sm:text-3xl font-black font-mono text-gray-900 dark:text-white">
                            ${currentEstBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            Estimated Balance
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('sheet')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#e66a00] hover:bg-[#cf5f00] text-white font-bold text-xs rounded transition-colors shadow-xs"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Buka Jurnal Trading</span>
                      </button>
                    </div>

                    {/* 6 Metrik KPI Finansial */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Gain / Return</span>
                        <span className={`text-base font-bold font-mono mt-0.5 block ${Number(totalGainPercent) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {Number(totalGainPercent) >= 0 ? `+${totalGainPercent}%` : `${totalGainPercent}%`}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Net Profit</span>
                        <span className={`text-base font-bold font-mono mt-0.5 block ${stats.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Pips</span>
                        <span className={`text-base font-bold font-mono mt-0.5 block ${stats.totalPips >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Win Rate</span>
                        <span className="text-base font-bold font-mono text-gray-900 dark:text-white mt-0.5 block">
                          {stats.winRate}%
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Profit Factor</span>
                        <span className="text-base font-bold font-mono text-gray-900 dark:text-white mt-0.5 block">
                          {stats.profitFactor}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Trades</span>
                        <span className="text-base font-bold font-mono text-gray-900 dark:text-white mt-0.5 block">
                          {stats.totalTrades}
                        </span>
                      </div>
                    </div>

                    {/* Kurva Equity Mini */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Kurva Pertumbuhan Akumulasi Pips</span>
                        <button 
                          onClick={() => onNavigate('analytics')}
                          className="text-[#e66a00] hover:underline"
                        >
                          Analisis Lengkap &rarr;
                        </button>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={equityData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="eqPipsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip 
                              formatter={(val: any) => [`${val} Pips`, 'Akumulasi']}
                              contentStyle={{ borderRadius: '4px', fontSize: '11px' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="pips"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#eqPipsGrad)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TABEL 'SISTEM TERBARU >' ALA MYFXBOOK SCREENSHOT */}
            <div className="bg-white dark:bg-[#181f2b] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#e66a00] transition-colors">
                    Sistem terbaru
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>

                <button
                  onClick={() => onNavigate('sheet')}
                  className="px-3 py-1 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Tambahkan akun Anda
                </button>
              </div>

              {/* Table Header & Rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] dark:bg-[#141a24] text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Sistem</th>
                      <th className="py-2.5 px-3 text-right">Keuntungan</th>
                      <th className="py-2.5 px-3 text-right">Drawdown</th>
                      <th className="py-2.5 px-3 text-right">Bulanan</th>
                      <th className="py-2.5 px-4 text-center">Performa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 font-sans">
                    {/* Baris Akun Pengguna Sendiri jika sudah ada transaksi */}
                    {trades.length > 0 && (
                      <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors bg-amber-50/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#e66a00] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              FX
                            </div>
                            <div>
                              <strong className="block text-gray-900 dark:text-white">{user.username} (Portofolio)</strong>
                              <span className="text-[10px] text-gray-500">{user.broker || 'MetaTrader 5'}</span>
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold font-mono ${Number(totalGainPercent) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {Number(totalGainPercent) >= 0 ? `+${totalGainPercent}%` : `${totalGainPercent}%`}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-600 dark:text-gray-400">
                          {stats.profitFactor} PF
                        </td>
                        <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                          +{stats.winRate}% WR
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="w-20 h-6 mx-auto">
                            <svg viewBox="0 0 100 20" className="w-full h-full stroke-emerald-500 fill-none stroke-2">
                              <path d="M0,16 Q25,8 50,14 T100,4" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Sample Systems matching the screenshot */}
                    {sampleSystems.map((sys, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                              idx === 0 ? 'bg-slate-400' : idx === 1 ? 'bg-orange-600' : 'bg-blue-600'
                            }`}>
                              {sys.name.charAt(0)}
                            </div>
                            <div>
                              <strong className="block text-gray-900 dark:text-white hover:text-[#e66a00] cursor-pointer">
                                {sys.name}
                              </strong>
                              <span className="text-[10px] text-gray-500">{sys.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                          {sys.gain}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-600 dark:text-gray-400">
                          {sys.drawdown}
                        </td>
                        <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                          {sys.monthly}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="w-20 h-6 mx-auto">
                            <svg viewBox="0 0 100 20" className="w-full h-full stroke-emerald-500 fill-none stroke-2">
                              <path d={sys.sparkline} />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* KOLOM KANAN (LEBAR ~30%): Jam Pasar & Berita Pasar Live */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. KOTAK 'JAM PASAR >' ALA MYFXBOOK SCREENSHOT */}
            <div className="bg-white dark:bg-[#181f2b] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div 
                  onClick={() => onNavigate('sheet')}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#e66a00] transition-colors">
                    Jam pasar
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Live Time</span>
              </div>

              {/* List Sesi Jam Pasar Dunia */}
              <div className="p-4 space-y-3">
                {marketSessions.map((session, idx) => {
                  const Icon = session.icon;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2.5 rounded bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{session.flag}</span>
                        <div>
                          <strong className="block text-xs text-gray-900 dark:text-white leading-tight">
                            {session.name}
                          </strong>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {session.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${session.isOpen ? 'text-amber-500 animate-spin-slow' : 'text-slate-400'}`} />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          session.isOpen 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. KOTAK BERITA REAL-TIME (FEED) */}
            <div className="bg-white dark:bg-[#181f2b] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Berita Forex Terkini
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs text-[#e66a00] hover:underline font-semibold"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="p-3 divide-y divide-gray-100 dark:divide-slate-800">
                {latestNews.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onNavigate('news')}
                    className="py-2.5 px-2 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold font-mono text-[#e66a00]">
                        {item.currency}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.publishedAt}</span>
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
