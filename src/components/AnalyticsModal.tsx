import React from 'react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { 
  X, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  LineChart as LineChartIcon,
  ShieldCheck,
  Target
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

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  trades,
}) => {
  if (!isOpen) return null;

  const stats = calculateStats(trades);

  // Performa berdasarkan Emosi
  const emotionStats: { [emotion: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const em = t.emosi || 'Lainnya';
    if (!emotionStats[em]) {
      emotionStats[em] = { count: 0, wins: 0, pips: 0 };
    }
    emotionStats[em].count += 1;
    if (t.pips > 0) emotionStats[em].wins += 1;
    emotionStats[em].pips += t.pips;
  });

  // Performa berdasarkan Pair
  const pairStats: { [pair: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const p = t.pair;
    if (!pairStats[p]) {
      pairStats[p] = { count: 0, wins: 0, pips: 0 };
    }
    pairStats[p].count += 1;
    if (t.pips > 0) pairStats[p].wins += 1;
    pairStats[p].pips += t.pips;
  });

  // Performa berdasarkan Strategi Setup (Fitur #8)
  const strategyStats: { [strat: string]: { count: number; wins: number; pips: number } } = {};
  trades.forEach((t) => {
    const st = t.strategi || 'Lainnya';
    if (!strategyStats[st]) {
      strategyStats[st] = { count: 0, wins: 0, pips: 0 };
    }
    strategyStats[st].count += 1;
    if (t.pips > 0) strategyStats[st].wins += 1;
    strategyStats[st].pips += t.pips;
  });

  // Kumulatif Pips / Equity Curve Data
  let runningPips = 0;
  const equityData = trades.map((t, i) => {
    runningPips += Number(t.pips) || 0;
    return {
      tradeNum: `#${i + 1}`,
      pair: t.pair,
      tanggal: t.tanggal,
      pips: runningPips,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs text-gray-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Laporan Analisis & Evaluasi Psikologi
              </h3>
              <p className="text-[11px] text-emerald-200">
                Equity curve, performa strategi & analisis psikologi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Quick Recap Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-3 text-center">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Win Rate</span>
              <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
                {stats.winRate}%
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg p-3 text-center">
              <span className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Total Akumulasi</span>
              <div className="text-xl font-extrabold text-blue-800 dark:text-blue-200 mt-1">
                {stats.totalPips > 0 ? `+${stats.totalPips}` : stats.totalPips} Pips
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-lg p-3 text-center">
              <span className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">Profit Factor</span>
              <div className="text-xl font-extrabold text-purple-800 dark:text-purple-200 mt-1">
                {stats.profitFactor}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-center">
              <span className="text-[11px] text-gray-600 dark:text-slate-400 font-medium">Trade Terbaik</span>
              <div className="text-xl font-extrabold text-gray-800 dark:text-slate-100 mt-1">
                +{stats.bestTradePips} Pips
              </div>
            </div>
          </div>

          {/* Equity Curve (Kurva Pertumbuhan Akun) */}
          {equityData.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
              <h4 className="font-bold text-gray-800 dark:text-slate-200 text-xs mb-2 flex items-center gap-1.5">
                <LineChartIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Kurva Pertumbuhan Pips Kumulatif (Equity Curve)</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#107c41" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#107c41" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b830" />
                    <XAxis dataKey="tradeNum" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded p-2 shadow-md text-[11px]">
                              <p className="font-bold text-gray-800 dark:text-slate-100">{data.tradeNum} - {data.pair}</p>
                              <p className="text-gray-500 dark:text-slate-400">{data.tanggal}</p>
                              <p className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                                Total: {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pips"
                      stroke="#107c41"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#equityGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Analisis Setup Strategi (Fitur #8) */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Efektivitas Setup Strategi (Strategi Mana yang Paling Menghasilkan?)</span>
            </h4>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2 font-semibold">Nama Setup / Teknik</th>
                    <th className="p-2 font-semibold text-center">Jumlah Trade</th>
                    <th className="p-2 font-semibold text-center">Win Rate</th>
                    <th className="p-2 font-semibold text-right">Net Pips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {Object.entries(strategyStats).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400 dark:text-slate-500">
                        Belum ada strategi yang di-tag.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(strategyStats).map(([strat, data]) => {
                      const winrate = ((data.wins / data.count) * 100).toFixed(0);
                      const isPositive = data.pips >= 0;

                      return (
                        <tr key={strat} className="hover:bg-white dark:hover:bg-slate-800/80">
                          <td className="p-2 font-bold text-gray-800 dark:text-slate-200">
                            🎯 {strat}
                          </td>
                          <td className="p-2 text-center text-gray-600 dark:text-slate-400">{data.count}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`font-semibold ${
                                Number(winrate) >= 50 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {winrate}%
                            </span>
                          </td>
                          <td
                            className={`p-2 text-right font-bold ${
                              isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analisis Psikologi Trading */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-excel-green dark:text-emerald-400" />
              <span>Dampak Emosi terhadap Hasil Trading</span>
            </h4>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2 font-semibold">Kondisi Emosi</th>
                    <th className="p-2 font-semibold text-center">Jumlah Trade</th>
                    <th className="p-2 font-semibold text-center">Win Rate</th>
                    <th className="p-2 font-semibold text-right">Net Pips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {Object.entries(emotionStats).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400 dark:text-slate-500">
                        Belum ada data emosi tercatat.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(emotionStats).map(([emotion, data]) => {
                      const winrate = ((data.wins / data.count) * 100).toFixed(0);
                      const isPositive = data.pips >= 0;

                      return (
                        <tr key={emotion} className="hover:bg-white dark:hover:bg-slate-800/80">
                          <td className="p-2 font-medium text-gray-800 dark:text-slate-200">
                            {emotion === 'FOMO' || emotion === 'Revenge Trade' ? (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                                <AlertTriangle className="w-3.5 h-3.5" /> {emotion}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />{' '}
                                {emotion}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-center text-gray-600 dark:text-slate-400">{data.count}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`font-semibold ${
                                Number(winrate) >= 50 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {winrate}%
                            </span>
                          </td>
                          <td
                            className={`p-2 text-right font-bold ${
                              isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analisis Berdasarkan Pair */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-excel-green dark:text-emerald-400" />
              <span>Performa Berdasarkan Pasangan Mata Uang (Pair)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(pairStats).length === 0 ? (
                <div className="col-span-2 p-3 text-center text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/50 rounded border dark:border-slate-700">
                  Belum ada pair yang dicatat.
                </div>
              ) : (
                Object.entries(pairStats).map(([pair, data]) => {
                  const winrate = ((data.wins / data.count) * 100).toFixed(0);
                  return (
                    <div
                      key={pair}
                      className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-slate-100">{pair}</span>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400">
                          {data.count} trades ({data.wins}W / {data.count - data.wins}L)
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            data.pips >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">WR: {winrate}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tips Disiplin Psikologi */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-amber-900 dark:text-amber-200">
            <h5 className="font-bold mb-1 flex items-center gap-1 text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Insight Trader Forex:
            </h5>
            <p className="text-[11px] leading-relaxed">
              Fokuslah hanya pada strategi dengan <strong>Win Rate &gt; 50%</strong> dan rasio Risk:Reward minimal <strong>1:2</strong>. Jangan memaksakan trade di luar setup teruji Anda saat market sedang lambat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-excel-green text-white font-semibold rounded text-xs hover:bg-excel-darkgreen transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
