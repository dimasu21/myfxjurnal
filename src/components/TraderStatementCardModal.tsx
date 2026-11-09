import React, { useRef } from 'react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { Trophy, Award, X, Download, CheckCircle2 } from 'lucide-react';

interface TraderStatementCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
  documentTitle: string;
}

export const TraderStatementCardModal: React.FC<TraderStatementCardModalProps> = ({
  isOpen,
  onClose,
  trades,
  documentTitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  if (!isOpen) return null;

  const stats = calculateStats(trades);

  // Cari best pair
  const pairCount: { [pair: string]: number } = {};
  trades.forEach((t) => {
    pairCount[t.pair] = (pairCount[t.pair] || 0) + (t.pips > 0 ? t.pips : 0);
  });
  const bestPair = Object.entries(pairCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'EUR/USD';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs text-gray-800 dark:text-slate-100 transition-colors">
        {/* Modal Top Bar */}
        <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-slate-100 text-xs">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Trader Performance Statement Card</span>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Aesthetic Printable Card Body */}
        <div className="p-4 flex justify-center bg-gray-50 dark:bg-slate-900/50">
          <div
            ref={cardRef}
            className="w-full bg-gradient-to-br from-emerald-900 via-[#0f5132] to-[#0a3622] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-emerald-700/50"
          >
            {/* Background Decorative Rings */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold block">
                  OFFICIAL TRADER STATEMENT
                </span>
                <h4 className="text-sm font-extrabold truncate max-w-[220px]">
                  {documentTitle.replace(/\.[^/.]+$/, '')}
                </h4>
              </div>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-xs">
                <Trophy className="w-5 h-5 text-yellow-300" />
              </div>
            </div>

            {/* Win Rate & Total Pips Big Showcase */}
            <div className="grid grid-cols-2 gap-3 my-4 py-1">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-xs text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-semibold">
                  Win Rate
                </span>
                <div className="text-3xl font-extrabold font-mono text-yellow-300 mt-0.5">
                  {stats.winRate}%
                </div>
                <span className="text-[10px] text-white/70">
                  {stats.winTrades} Menang / {stats.totalTrades} Trade
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-xs text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-semibold">
                  Net Result
                </span>
                <div
                  className={`text-3xl font-extrabold font-mono mt-0.5 ${
                    stats.totalPips >= 0 ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {stats.totalPips > 0 ? `+${stats.totalPips}` : stats.totalPips}
                </div>
                <span className="text-[10px] text-white/70">Pips Akumulatif</span>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-white/10 pt-3">
              <div>
                <span className="text-emerald-300/80 block">Profit Factor</span>
                <strong className="text-xs font-mono font-bold">{stats.profitFactor}</strong>
              </div>
              <div>
                <span className="text-emerald-300/80 block">Best Pair</span>
                <strong className="text-xs font-mono font-bold">{bestPair}</strong>
              </div>
              <div>
                <span className="text-emerald-300/80 block">Trade Terbaik</span>
                <strong className="text-xs font-mono font-bold">+{stats.bestTradePips}p</strong>
              </div>
            </div>

            {/* Card Badge Footer */}
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <span className="flex items-center gap-1 text-emerald-200 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Disiplin Jurnal Forex
              </span>
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            Siap dibagikan ke Telegram / Komunitas
          </span>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-3.5 py-1.5 bg-excel-green text-white font-bold rounded-lg text-xs hover:bg-excel-darkgreen flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cetak / Simpan Rapor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
