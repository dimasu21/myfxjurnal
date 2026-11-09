import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  RotateCcw,
  Sliders,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';

interface CompoundingViewProps {
  onBack: () => void;
}

export const CompoundingView: React.FC<CompoundingViewProps> = ({ onBack }) => {
  const [initialCapital, setInitialCapital] = useState<number>(10);
  const [targetPercent, setTargetPercent] = useState<number>(10);
  const [periods, setPeriods] = useState<number>(12);
  const [periodType, setPeriodType] = useState<'BULAN' | 'TRADE'>('BULAN');

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

  // Hitung tabel compounding
  const rows = [];
  let currentBalance = initialCapital;

  for (let i = 1; i <= periods; i++) {
    const profit = currentBalance * (targetPercent / 100);
    const endBalance = currentBalance + profit;
    const roi = initialCapital > 0 ? ((endBalance - initialCapital) / initialCapital) * 100 : 0;
    rows.push({
      period: i,
      start: currentBalance,
      profit,
      end: endBalance,
      roi,
    });
    currentBalance = endBalance;
  }

  const finalBalance = rows.length > 0 ? rows[rows.length - 1].end : initialCapital;
  const totalGain = finalBalance - initialCapital;
  const totalGrowthPercent = initialCapital > 0 ? ((totalGain / initialCapital) * 100).toFixed(0) : '0';

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
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Simulator Target Modal (Compounding)</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Simulasi eksponensial pertumbuhan saldo akun dengan disiplin target profit terukur
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-xl p-5 shadow-xs border border-emerald-800/40">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Proyeksi Saldo Akhir
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
              ${finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-emerald-300/80 mt-1 block">
              Setelah {periods} {periodType.toLowerCase()}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Keuntungan Bersih
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-400">
              +${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
              Modal Awal: ${initialCapital}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Persentase Pertumbuhan (ROI)
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-cyan-600 dark:text-cyan-400">
              +{totalGrowthPercent}%
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
              Konsistensi {targetPercent}% / {periodType.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Inputs & Controls */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Pengaturan Rencana Compounding</h2>
            </div>
            <button
              onClick={() => {
                setInitialCapital(10);
                setTargetPercent(10);
                setPeriods(12);
                setPeriodType('BULAN');
              }}
              className="text-xs text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Modal Awal */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Modal Awal ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-1 mt-1.5">
                {[10, 50, 100, 500].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setInitialCapital(m)}
                    className="flex-1 py-0.5 text-[10px] rounded border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    ${m}
                  </button>
                ))}
              </div>
            </div>

            {/* Target % */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Target Profit per Periode (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="1"
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[5, 10, 15, 20].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTargetPercent(t)}
                    className="flex-1 py-0.5 text-[10px] rounded border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    {t}%
                  </button>
                ))}
              </div>
            </div>

            {/* Durasi Periode */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Durasi Jumlah Periode
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={periods}
                onChange={(e) => setPeriods(Math.min(60, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-1 mt-1.5">
                {[6, 12, 24, 36].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriods(p)}
                    className="flex-1 py-0.5 text-[10px] rounded border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Satuan Periode */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Satuan Periode
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPeriodType('BULAN')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    periodType === 'BULAN'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodType('TRADE')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    periodType === 'TRADE'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50'
                  }`}
                >
                  Per Trade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compounding Table Schedule */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Tabel Jadwal Pertumbuhan Proyektif ({periods} Periode)
            </h3>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              Reinvestasi Profit 100%
            </span>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-800 text-[11px] uppercase font-bold text-gray-500 dark:text-slate-400 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3 text-right">Saldo Awal ($)</th>
                  <th className="px-4 py-3 text-right">Target Profit ({targetPercent}%)</th>
                  <th className="px-4 py-3 text-right">Saldo Akhir ($)</th>
                  <th className="px-4 py-3 text-right">Akumulasi ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono">
                {rows.map((row) => (
                  <tr key={row.period} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-2.5 font-sans font-semibold text-gray-900 dark:text-white">
                      {periodType === 'BULAN' ? `Bulan ke-${row.period}` : `Trade ke-${row.period}`}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-slate-400">
                      ${row.start.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      +${row.profit.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-white">
                      ${row.end.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-cyan-600 dark:text-cyan-400">
                      +{row.roi.toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

