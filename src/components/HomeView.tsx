import React, { useState, useMemo } from 'react';
import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { generateRealtimeNews, ForexNewsItem } from '../utils/newsService';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Radio, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  ChevronRight, 
  Plus,
  FileSpreadsheet
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
  const [activeTab, setActiveTab] = useState<'my-account' | 'watchlist'>('my-account');

  // Perhitungan statistik portofolio nyata dari transaksi
  const stats = useMemo(() => calculateStats(trades), [trades]);

  // Data kumulatif Pips untuk grafik Equity nyata
  const equityData = useMemo(() => {
    let cumulative = 0;
    if (trades.length === 0) {
      return [{ name: '0', pips: 0 }];
    }
    return trades.map((t, idx) => {
      cumulative += Number(t.pips) || 0;
      return {
        name: `T${idx + 1}`,
        pips: cumulative,
      };
    });
  }, [trades]);

  const latestNews = useMemo<ForexNewsItem[]>(() => generateRealtimeNews().slice(0, 4), []);

  // Jam Pasar Nyata dihitung dari jam UTC saat ini
  const currentUtcHour = new Date().getUTCHours();
  const marketSessions = [
    { 
      name: 'New York', 
      isOpen: currentUtcHour >= 13 && currentUtcHour < 22, 
      status: currentUtcHour >= 13 && currentUtcHour < 22 ? 'Buka' : 'Tutup', 
      time: '13:00 - 22:00 UTC', 
      icon: currentUtcHour >= 13 && currentUtcHour < 22 ? Sun : Moon, 
      flag: '🇺🇸' 
    },
    { 
      name: 'London', 
      isOpen: currentUtcHour >= 8 && currentUtcHour < 17, 
      status: currentUtcHour >= 8 && currentUtcHour < 17 ? 'Buka' : 'Tutup', 
      time: '08:00 - 17:00 UTC', 
      icon: currentUtcHour >= 8 && currentUtcHour < 17 ? Sun : Moon, 
      flag: '🇬🇧' 
    },
    { 
      name: 'Tokyo', 
      isOpen: currentUtcHour >= 0 && currentUtcHour < 9, 
      status: currentUtcHour >= 0 && currentUtcHour < 9 ? 'Buka' : 'Tutup', 
      time: '00:00 - 09:00 UTC', 
      icon: currentUtcHour >= 0 && currentUtcHour < 9 ? Sun : Moon, 
      flag: '🇯🇵' 
    },
    { 
      name: 'Sydney', 
      isOpen: currentUtcHour >= 22 || currentUtcHour < 7, 
      status: currentUtcHour >= 22 || currentUtcHour < 7 ? 'Buka' : 'Tutup', 
      time: '22:00 - 07:00 UTC', 
      icon: currentUtcHour >= 22 || currentUtcHour < 7 ? Sun : Moon, 
      flag: '🇦🇺' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7f9] dark:bg-[#0f172a] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Centered Main Container */}
      <div className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 pb-24 md:pb-10 space-y-6">

        {/* 2-Column Grid Layout Terpusat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================ */}
          {/* KOLOM KIRI (LEBAR ~70%): Akun Saya & Riwayat Entri Jurnal */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. KOTAK 'AKUN SAYA' & PORTOFOLIO */}
            <div className="bg-white dark:bg-[#1a2232] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              
              {/* Tabs Bar Header */}
              <div className="bg-[#f8fafc] dark:bg-[#141a24] border-b border-gray-200 dark:border-slate-800 px-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('my-account')}
                    className={`px-4 py-2 text-xs font-bold transition-all rounded-t border-t-2 ${
                      activeTab === 'my-account'
                        ? 'bg-white dark:bg-[#1a2232] text-gray-900 dark:text-white border-t-[#107c41] border-x border-gray-200 dark:border-slate-800 -mb-[1px]'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 border-t-transparent'
                    }`}
                  >
                    Akun Saya
                  </button>
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`px-4 py-2 text-xs font-bold transition-all rounded-t border-t-2 ${
                      activeTab === 'watchlist'
                        ? 'bg-white dark:bg-[#1a2232] text-gray-900 dark:text-white border-t-[#107c41] border-x border-gray-200 dark:border-slate-800 -mb-[1px]'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 border-t-transparent'
                    }`}
                  >
                    Ringkasan Jurnal
                  </button>
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <button
                    onClick={onOpenNewTrade}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 rounded text-xs font-semibold cursor-pointer border border-gray-300 dark:border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Entri Baru</span>
                  </button>
                  <button
                    onClick={() => onNavigate('sheet')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#107c41] hover:bg-[#0e6b37] text-white rounded text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Buka Spreadsheet</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-5 space-y-5">

                {/* 6 Metrik KPI Finansial Riil (Dari Jurnal) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
                  <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Net Profit ($)</span>
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

                  <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded p-2.5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Menang / Kalah</span>
                    <span className="text-base font-bold font-mono text-gray-900 dark:text-white mt-0.5 block">
                      {stats.winTrades}W / {stats.lossTrades}L
                    </span>
                  </div>
                </div>

                {/* Kurva Pertumbuhan Equity Riil */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#107c41] dark:text-emerald-400" />
                      <span className="text-gray-800 dark:text-gray-200">Kurva Akumulasi Pips</span>
                    </div>
                    <button 
                      onClick={() => onNavigate('analytics')}
                      className="text-[#107c41] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Lihat Detail Grafik &rarr;
                    </button>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={equityData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="eqPipsGradExcel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#107c41" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#107c41" stopOpacity={0.0} />
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
                          stroke="#107c41"
                          strokeWidth={2}
                          fill="url(#eqPipsGradExcel)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {trades.length === 0 && (
                    <p className="text-center text-[11px] text-gray-400 pt-1">
                      Belum ada trade yang dicatat. Entri baru di spreadsheet akan langsung menggambar kurva akumulasi Anda di sini.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. TABEL 'RIWAYAT ENTRI JURNAL TERBARU' */}
            <div className="bg-white dark:bg-[#1a2232] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#107c41] transition-colors">
                    Entri Jurnal Terbaru
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>

                <button
                  onClick={() => onNavigate('sheet')}
                  className="px-3 py-1 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#107c41]" />
                  <span>Buka Semua di Sheet</span>
                </button>
              </div>

              {/* Table Rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] dark:bg-[#141a24] text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Tanggal & Pair</th>
                      <th className="py-2.5 px-3">Tipe & Lot</th>
                      <th className="py-2.5 px-3 text-right">Pips</th>
                      <th className="py-2.5 px-3 text-right">Profit / Rugi ($)</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 font-sans">
                    {trades.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                          Belum ada transaksi tercatat. Klik "Buka Semua di Sheet" atau tombol "+ Entri Baru" di atas untuk mencatat.
                        </td>
                      </tr>
                    ) : (
                      trades.slice(-5).reverse().map((t) => {
                        const isWin = t.status === 'WIN' || Number(t.pips) > 0;
                        const isLoss = t.status === 'LOSS' || Number(t.pips) < 0;
                        return (
                          <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <strong className="block text-gray-900 dark:text-white font-mono">{t.pair}</strong>
                              <span className="text-[10px] text-gray-500">{t.tanggal} {t.strategi ? `• ${t.strategi}` : ''}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                t.posisi === 'BUY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {t.posisi}
                              </span>
                              <span className="ml-1.5 font-mono text-gray-600 dark:text-gray-300">{t.lot}</span>
                            </td>
                            <td className={`py-3 px-3 text-right font-bold font-mono ${
                              isWin ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-gray-500'
                            }`}>
                              {Number(t.pips) > 0 ? `+${t.pips}` : t.pips}
                            </td>
                            <td className={`py-3 px-3 text-right font-bold font-mono ${
                              isWin ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-gray-500'
                            }`}>
                              {t.pnl !== undefined ? (
                                Number(t.pnl) >= 0 ? `+$${t.pnl}` : `-$${Math.abs(Number(t.pnl))}`
                              ) : '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                isWin ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                                isLoss ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                                'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                              }`}>
                                {t.status || (isWin ? 'WIN' : isLoss ? 'LOSS' : 'BE')}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* KOLOM KANAN (LEBAR ~30%): Jam Pasar & Berita Pasar Live */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. KOTAK 'JAM PASAR' NYATA */}
            <div className="bg-white dark:bg-[#1a2232] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div 
                  onClick={() => onNavigate('sheet')}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#107c41] transition-colors">
                    Jam Pasar Forex
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-[11px] text-[#107c41] dark:text-emerald-400 font-semibold">Live Time</span>
              </div>

              {/* List Sesi Jam Pasar Dunia */}
              <div className="p-4 space-y-2.5">
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
                        <Icon className={`w-3.5 h-3.5 ${session.isOpen ? 'text-amber-500' : 'text-slate-400'}`} />
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
            <div className="bg-white dark:bg-[#1a2232] border border-gray-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Berita Forex Terkini
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs text-[#107c41] dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="p-3 divide-y divide-gray-100 dark:divide-slate-800">
                {latestNews.slice(0, 3).map((item: ForexNewsItem) => (
                  <div 
                    key={item.id} 
                    onClick={() => onNavigate('news')}
                    className="py-2.5 px-2 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold font-mono text-[#107c41] dark:text-emerald-400">
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
