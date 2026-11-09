import React, { useRef, useState, useEffect } from 'react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { 
  ArrowLeft, 
  Award, 
  Download, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  TrendingUp, 
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface TraderStatementCardViewProps {
  onBack: () => void;
  trades: Trade[];
  documentTitle: string;
}

export const TraderStatementCardView: React.FC<TraderStatementCardViewProps> = ({
  onBack,
  trades,
  documentTitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [traderName, setTraderName] = useState('Professional Trader');
  const [copied, setCopied] = useState(false);

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

  // Cari best pair
  const pairCount: { [pair: string]: number } = {};
  trades.forEach((t) => {
    pairCount[t.pair] = (pairCount[t.pair] || 0) + (t.pips > 0 ? t.pips : 0);
  });
  const bestPair = Object.entries(pairCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'EUR/USD';

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const text = `Official Trading Performance Report\nDokumen: ${documentTitle}\nWin Rate: ${stats.winRate}%\nTotal Transaksi: ${stats.totalTrades}\nNet Pips: ${stats.totalPips >= 0 ? '+' : ''}${stats.totalPips} Pips\nProfit Factor: ${stats.profitFactor}\nBest Pair: ${bestPair}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              <Award className="w-4 h-4 text-amber-500" />
              <span>Trader Statement Performance Card</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Sertifikat rapor rekapitulasi performa resmi untuk arsip atau dibagikan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareSummary}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center space-y-6">
        {/* Name input */}
        <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 shrink-0">Nama Trader:</label>
          <input
            type="text"
            value={traderName}
            onChange={(e) => setTraderName(e.target.value)}
            placeholder="Masukkan nama Anda..."
            className="w-full px-2.5 py-1 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* The Card */}
        <div
          ref={cardRef}
          className="w-full max-w-xl bg-gradient-to-br from-emerald-950 via-[#0f3d2a] to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-700/40"
        >
          {/* Subtle Decorative glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 relative z-10">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                Official Trading Performance Report
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide mt-0.5">
                {traderName || 'Professional Trader'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="w-6 h-6 text-emerald-300" />
            </div>
          </div>

          {/* Main Win Rate Highlight */}
          <div className="py-6 flex items-center justify-between border-b border-white/10 relative z-10">
            <div>
              <span className="text-xs text-emerald-200/80 uppercase tracking-wider block font-semibold">
                Win Rate Keseluruhan
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight mt-1">
                {stats.winRate}%
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs text-emerald-300 font-mono font-semibold">
                {stats.winTrades} Win / {stats.lossTrades} Loss
              </div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips} Pips
              </div>
            </div>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-3 gap-3 py-4 border-b border-white/10 relative z-10">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-300/80 block uppercase">Profit Factor</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5 block">{stats.profitFactor}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-300/80 block uppercase">Best Pair</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5 block">{bestPair}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-emerald-300/80 block uppercase">Total Trades</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5 block">{stats.totalTrades}</span>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-4 flex items-center justify-between text-[11px] text-emerald-300/70 relative z-10">
            <span className="font-mono">{documentTitle}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Jurnal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
