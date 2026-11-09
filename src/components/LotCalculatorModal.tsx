import React, { useState } from 'react';
import { calculateLotSize } from '../utils/forexHelpers';
import { Calculator, X, ShieldAlert, ArrowRight, Check } from 'lucide-react';

interface LotCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLot?: (calculatedLot: string) => void;
  initialPair?: string;
  initialSlPips?: number;
}

export const LotCalculatorModal: React.FC<LotCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyLot,
  initialPair = 'EUR/USD',
  initialSlPips = 20,
}) => {
  const [balance, setBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [slPips, setSlPips] = useState<number>(initialSlPips || 20);
  const [pair, setPair] = useState<string>(initialPair);

  if (!isOpen) return null;

  const result = calculateLotSize(balance, riskPercent, slPips, pair);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm">Kalkulator Lot & Manajemen Risiko</h3>
              <p className="text-[10px] text-emerald-100">Kalkulasi presisi agar akun anti Margin Call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3.5">
          {/* Pair & Balance */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Forex Pair
              </label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold focus:border-excel-green focus:outline-none"
              >
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/JPY">USD/JPY</option>
                <option value="XAU/USD">XAU/USD (Gold)</option>
                <option value="AUD/USD">AUD/USD</option>
                <option value="USD/CAD">USD/CAD</option>
                <option value="BTC/USD">BTC/USD</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Saldo Akun (USD $)
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                placeholder="misal: 1000"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
            </div>
          </div>

          {/* Risk % & SL Pips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-gray-700">Risiko Akun (%)</label>
                <span className="text-[10px] text-emerald-700 font-bold">${result.riskAmount}</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[0.5, 1, 2, 3].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setRiskPercent(pct)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      riskPercent === pct
                        ? 'bg-excel-green text-white border-excel-green'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Jarak SL (Pips)
              </label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(parseFloat(e.target.value) || 0)}
                placeholder="misal: 25"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[15, 20, 30, 50].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSlPips(p)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      slPips === p
                        ? 'bg-excel-green text-white border-excel-green'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {p}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hasil Perhitungan Lot Terbesar */}
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 text-center space-y-1">
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
              Ukuran Lot yang Disarankan:
            </span>
            <div className="text-3xl font-extrabold text-emerald-900 font-mono">
              {result.standardLots} <span className="text-sm font-semibold">Standard Lot</span>
            </div>
            <p className="text-[10px] text-emerald-700">
              Jika SL {slPips} pips tersentuh, kerugian Anda maksimal{' '}
              <strong className="text-rose-700">-${result.riskAmount}</strong> ({riskPercent}% dari modal)
            </p>
          </div>

          {/* Breakdown Mini/Micro Lots */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Mini Lot (0.1)</span>
              <strong className="font-mono text-gray-800 text-xs">{result.miniLots} mini</strong>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Micro Lot (0.01)</span>
              <strong className="font-mono text-gray-800 text-xs">{result.microLots} micro</strong>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Nilai per Pip</span>
              <strong className="font-mono text-emerald-700 text-xs">${result.pipValue}</strong>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Disiplin 1-2% risk per trade
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-100"
            >
              Tutup
            </button>
            {onApplyLot && (
              <button
                onClick={() => {
                  onApplyLot(`${result.standardLots} Lot`);
                  onClose();
                }}
                className="px-3 py-1.5 bg-excel-green text-white font-bold rounded text-xs hover:bg-excel-darkgreen flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Gunakan {result.standardLots} Lot</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

