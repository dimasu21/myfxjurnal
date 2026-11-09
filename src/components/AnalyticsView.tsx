import React, { useEffect } from 'react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle,
  LineChart as LineChartIcon,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface AnalyticsViewProps {
  onBack: () => void;
  trades: Trade[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack, trades }) => {
  // Keyboard shortcut Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const stats = calculateStats(trades);

  // Perhitungan Avg Win, Avg Loss & Consecutive Streaks
  const winTradesList = trades.filter((t) => t.status === 'WIN' || t.pips > 0);
  const lossTradesList = trades.filter((t) => t.status === 'LOSS' || t.pips < 0);
  const avgWin = winTradesList.length > 0 ? (winTradesList.reduce((acc, t) => acc + t.pips, 0) / winTradesList.length).toFixed(1) : 0;
  const avgLoss = lossTradesList.length > 0 ? (Math.abs(lossTradesList.reduce((acc, t) => acc + t.pips, 0)) / lossTradesList.length).toFixed(1) : 0;

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  trades.forEach((t) => {
    if (t.status === 'WIN' || t.pips > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else if (t.status === 'LOSS' || t.pips < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
      if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  });

  // Performa berdasarkan Emosi
  const emotionStats: { [emotion: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const em = t.emosi || 'Lainnya';
    if (!emotionStats[em]) {
      emotionStats[em] = { count: 0, wins: 0, pips: 0 };
    }
    emotionStats[em].count += 1;
    if (t.pips > 0 || t.status === 'WIN') emotionStats[em].wins += 1;
    emotionStats[em].pips += Number(t.pips) || 0;
  });

  // Performa berdasarkan Pair
  const pairStats: { [pair: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const p = t.pair || 'Lainnya';
    if (!pairStats[p]) {
      pairStats[p] = { count: 0, wins: 0, pips: 0 };
    }
    pairStats[p].count += 1;
    if (t.pips > 0 || t.status === 'WIN') pairStats[p].wins += 1;
    pairStats[p].pips += Number(t.pips) || 0;
  });

  // Performa berdasarkan Strategi
  const strategyStats: { [strat: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const s = t.strategi || 'Umum';
    if (!strategyStats[s]) {
      strategyStats[s] = { count: 0, wins: 0, pips: 0 };
    }
    strategyStats[s].count += 1;
    if (t.pips > 0 || t.status === 'WIN') strategyStats[s].wins += 1;
    strategyStats[s].pips += Number(t.pips) || 0;
  });

  // Cumulative Pips for Equity Curve
  let cumulative = 0;
  const equityData = trades.map((t, index) => {
    cumulative += Number(t.pips) || 0;
    return {
      index: index + 1,
      trade: `${t.pair} (${t.tanggal})`,
      pips: cumulative,
      rawPips: Number(t.pips) || 0,
    };
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-800 dark:text-slate-100 overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
            title="Kembali ke lembar kerja Excel (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Sheet</span>
          </button>
          <div className="h-5 w-[1px] bg-gray-300 dark:bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Statistik & Analisis Performa Trading</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Laporan mendalam evaluasi win rate, kurva ekuitas, strategi setup, dan psikologi trading
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-slate-400 font-mono">
          Total Transaksi: <strong className="text-gray-900 dark:text-white">{stats.totalTrades}</strong>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Win Rate
            </span>
            <div className={`text-2xl font-black font-mono mt-1 ${stats.winRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {stats.winRate}%
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">{stats.winTrades} W / {stats.lossTrades} L</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Pips
            </span>
            <div className={`text-2xl font-black font-mono mt-1 ${stats.totalPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips}
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Net Pips Akumulasi</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Profit Factor
            </span>
            <div className="text-2xl font-black font-mono mt-1 text-blue-600 dark:text-blue-400">
              {stats.profitFactor}
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Rasio Laba / Rugi</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Rata-rata Win
            </span>
            <div className="text-2xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-400">
              +{avgWin}
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Pips per Win Trade</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Rata-rata Loss
            </span>
            <div className="text-2xl font-black font-mono mt-1 text-rose-600 dark:text-rose-400">
              {avgLoss}
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Pips per Loss Trade</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Max Streak
            </span>
            <div className="text-2xl font-black font-mono mt-1 text-gray-800 dark:text-slate-200">
              {maxWinStreak}W / {maxLossStreak}L
            </div>
            <span className="text-[11px] text-gray-400 block mt-0.5">Rekor Beruntun</span>
          </div>
        </div>

        {/* Equity Curve Area Chart */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Kurva Pertumbuhan Akun (Equity Curve)
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">Akumulasi Pips Historis</span>
          </div>

          {equityData.length === 0 ? (
            <div className="py-16 text-center text-gray-400 dark:text-slate-500 text-xs">
              Belum ada data transaksi yang dicatat.
            </div>
          ) : (
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="index" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      color: '#fff',
                      fontSize: '12px',
                      borderRadius: '8px',
                    }}
                    formatter={(val: any) => [`${Number(val) > 0 ? '+' : ''}${val} Pips`, 'Akumulasi']}
                    labelFormatter={(label) => `Trade #${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="pips"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#equityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 3 Breakdown Columns: Strategi, Psikologi Emosi, Instrumen Pair */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Setup Strategi */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Performa Strategi
              </h3>
            </div>
            <div className="space-y-3">
              {Object.keys(strategyStats).length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Nihil</p>
              ) : (
                Object.entries(strategyStats).map(([st, data]) => {
                  const wr = data.count > 0 ? (data.wins / data.count) * 100 : 0;
                  return (
                    <div key={st} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-gray-900 dark:text-white">{st}</strong>
                        <span className="font-mono font-bold text-gray-700 dark:text-slate-300">
                          {wr.toFixed(0)}% WR
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                        <span>{data.count} Transaksi</span>
                        <span className={`font-mono font-semibold ${data.pips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {data.pips >= 0 ? `+${data.pips}` : data.pips} pips
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Psikologi & Emosi */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
              <BrainCircuit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Analisis Emosi & Psikologi
              </h3>
            </div>
            <div className="space-y-3">
              {Object.keys(emotionStats).length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Nihil</p>
              ) : (
                Object.entries(emotionStats).map(([em, data]) => {
                  const wr = data.count > 0 ? (data.wins / data.count) * 100 : 0;
                  const isToxic = em.includes('FOMO') || em.includes('Dendam') || em.includes('Serakah');
                  return (
                    <div key={em} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-bold ${isToxic ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                          {em}
                        </span>
                        <span className="font-mono font-bold text-gray-700 dark:text-slate-300">
                          {wr.toFixed(0)}% WR
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                        <span>{data.count} Transaksi</span>
                        <span className={`font-mono font-semibold ${data.pips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {data.pips >= 0 ? `+${data.pips}` : data.pips} pips
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Instrumen Pair */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
              <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Performa Pasangan Pair
              </h3>
            </div>
            <div className="space-y-3">
              {Object.keys(pairStats).length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Nihil</p>
              ) : (
                Object.entries(pairStats).map(([p, data]) => {
                  const wr = data.count > 0 ? (data.wins / data.count) * 100 : 0;
                  return (
                    <div key={p} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{p}</span>
                        <span className="font-mono font-bold text-gray-700 dark:text-slate-300">
                          {wr.toFixed(0)}% WR
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                        <span>{data.count} Transaksi</span>
                        <span className={`font-mono font-semibold ${data.pips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {data.pips >= 0 ? `+${data.pips}` : data.pips} pips
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
