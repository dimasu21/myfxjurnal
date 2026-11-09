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
  ShieldCheck
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Laporan Analisis & Evaluasi Psikologi
              </h3>
              <p className="text-[11px] text-emerald-200">
                Equity curve, deteksi FOMO/Revenge Trading & performa pair
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <span className="text-[11px] text-emerald-700 font-medium">Win Rate</span>
              <div className="text-xl font-extrabold text-emerald-800 mt-1">
                {stats.winRate}%
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <span className="text-[11px] text-blue-700 font-medium">Total Akumulasi</span>
              <div className="text-xl font-extrabold text-blue-800 mt-1">
                {stats.totalPips > 0 ? `+${stats.totalPips}` : stats.totalPips} Pips
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <span className="text-[11px] text-purple-700 font-medium">Profit Factor</span>
              <div className="text-xl font-extrabold text-purple-800 mt-1">
                {stats.profitFactor}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
              <span className="text-[11px] text-gray-600 font-medium">Trade Terbaik</span>
              <div className="text-xl font-extrabold text-gray-800 mt-1">
                +{stats.bestTradePips} Pips
              </div>
            </div>
          </div>

          {/* Equity Curve (Kurva Pertumbuhan Akun) */}
          {equityData.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <h4 className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1.5">
                <LineChartIcon className="w-4 h-4 text-emerald-600" />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="tradeNum" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-gray-200 rounded p-2 shadow-md text-[11px]">
                              <p className="font-bold text-gray-800">{data.tradeNum} - {data.pair}</p>
                              <p className="text-gray-500">{data.tanggal}</p>
                              <p className="font-mono font-extrabold text-emerald-700 mt-0.5">
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

          {/* Analisis Psikologi Trading */}
          <div>
            <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-excel-green" />
              <span>Dampak Emosi terhadap Hasil Trading</span>
            </h4>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="p-2 font-semibold">Kondisi Emosi</th>
                    <th className="p-2 font-semibold text-center">Jumlah Trade</th>
                    <th className="p-2 font-semibold text-center">Win Rate</th>
                    <th className="p-2 font-semibold text-right">Net Pips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(emotionStats).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400">
                        Belum ada data emosi tercatat.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(emotionStats).map(([emotion, data]) => {
                      const winrate = ((data.wins / data.count) * 100).toFixed(0);
                      const isPositive = data.pips >= 0;

                      return (
                        <tr key={emotion} className="hover:bg-white">
                          <td className="p-2 font-medium text-gray-800">
                            {emotion === 'FOMO' || emotion === 'Revenge Trade' ? (
                              <span className="text-rose-600 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> {emotion}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{' '}
                                {emotion}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-center text-gray-600">{data.count}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`font-semibold ${
                                Number(winrate) >= 50 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {winrate}%
                            </span>
                          </td>
                          <td
                            className={`p-2 text-right font-bold ${
                              isPositive ? 'text-emerald-700' : 'text-rose-700'
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
            <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-excel-green" />
              <span>Performa Berdasarkan Pasangan Mata Uang (Pair)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(pairStats).length === 0 ? (
                <div className="col-span-2 p-3 text-center text-gray-400 bg-gray-50 rounded border">
                  Belum ada pair yang dicatat.
                </div>
              ) : (
                Object.entries(pairStats).map(([pair, data]) => {
                  const winrate = ((data.wins / data.count) * 100).toFixed(0);
                  return (
                    <div
                      key={pair}
                      className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-gray-900">{pair}</span>
                        <p className="text-[11px] text-gray-500">
                          {data.count} trades ({data.wins}W / {data.count - data.wins}L)
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            data.pips >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                        </div>
                        <span className="text-[10px] text-gray-500">WR: {winrate}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tips Disiplin Psikologi */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
            <h5 className="font-bold mb-1 flex items-center gap-1 text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Insight Trader Forex:
            </h5>
            <p className="text-[11px] leading-relaxed">
              Catatan jurnal membuktikan bahwa trader yang disiplin membatasi risiko maksimal <strong>1-2% modal per trade</strong> dan tidak melakukan <strong>Revenge Trading</strong> pasca SL tersentuh memiliki probabilitas bertahan hidup di pasar forex di atas 90%.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t border-gray-200 flex justify-end">
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
