import React, { useState } from 'react';
import { Target, X, TrendingUp, DollarSign, Calculator } from 'lucide-react';

interface CompoundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompoundingModal: React.FC<CompoundingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [initialCapital, setInitialCapital] = useState<number>(10);
  const [targetPercent, setTargetPercent] = useState<number>(10);
  const [periods, setPeriods] = useState<number>(12);
  const [periodType, setPeriodType] = useState<'BULAN' | 'TRADE'>('BULAN');

  if (!isOpen) return null;

  // Hitung tabel compounding
  const rows = [];
  let currentBalance = initialCapital;

  for (let i = 1; i <= periods; i++) {
    const profit = currentBalance * (targetPercent / 100);
    const endBalance = currentBalance + profit;
    rows.push({
      period: i,
      start: currentBalance,
      profit,
      end: endBalance,
    });
    currentBalance = endBalance;
  }

  const finalBalance = rows.length > 0 ? rows[rows.length - 1].end : initialCapital;
  const totalGain = finalBalance - initialCapital;
  const totalGrowthPercent = initialCapital > 0 ? ((totalGain / initialCapital) * 100).toFixed(0) : '0';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Simulator Pertumbuhan Modal (Compounding)</h3>
              <p className="text-[11px] text-emerald-100">
                Kekuatan bunga berbunga (The Power of Compounding) untuk konsistensi trading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Modal Awal ($)
              </label>
              <input
                type="number"
                step="any"
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[10, 50, 100, 500].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setInitialCapital(v)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 hover:bg-gray-200 text-gray-700 border"
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Target Return (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={targetPercent}
                onChange={(e) => setTargetPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[5, 10, 15, 20].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTargetPercent(p)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 hover:bg-gray-200 text-gray-700 border"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Jumlah Periode
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={periods}
                  onChange={(e) => setPeriods(Math.min(36, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
                />
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as any)}
                  className="flex-1 px-1 py-1.5 border border-gray-300 rounded text-[11px] font-bold"
                >
                  <option value="BULAN">Bulan</option>
                  <option value="TRADE">Trade</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Card Highlight */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                Proyeksi Saldo Akhir ({periods} {periodType.toLowerCase()}):
              </span>
              <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                ${finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 block">
                Total Profit: +${totalGain.toFixed(2)}
              </span>
              <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                +{totalGrowthPercent}%
              </span>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-semibold sticky top-0 border-b border-gray-200">
                <tr>
                  <th className="p-2"># {periodType}</th>
                  <th className="p-2 text-right">Saldo Awal</th>
                  <th className="p-2 text-right">Profit ({targetPercent}%)</th>
                  <th className="p-2 text-right">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono">
                {rows.map((r) => (
                  <tr key={r.period} className="hover:bg-gray-50">
                    <td className="p-2 font-bold text-gray-800">
                      {periodType === 'BULAN' ? `Bulan ${r.period}` : `Trade ${r.period}`}
                    </td>
                    <td className="p-2 text-right text-gray-600">
                      ${r.start.toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-emerald-700 font-bold">
                      +${r.profit.toFixed(2)}
                    </td>
                    <td className="p-2 text-right font-extrabold text-gray-900">
                      ${r.end.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-excel-green text-white font-bold rounded text-xs hover:bg-excel-darkgreen transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

