import React, { useState } from 'react';
import { calculateLotSize } from '../utils/forexHelpers';
import { Calculator, X, ShieldAlert, Check, Coins, AlertCircle } from 'lucide-react';

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
  const [balance, setBalance] = useState<number>(10);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [slPips, setSlPips] = useState<number>(initialSlPips || 20);
  const [pair, setPair] = useState<string>(initialPair);

  if (!isOpen) return null;

  const result = calculateLotSize(balance, riskPercent, slPips, pair);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm">Kalkulator Lot & Manajemen Risiko</h3>
              <p className="text-[10px] text-emerald-100">Mendukung modal mikro ($10) hingga akun besar ($100k)</p>
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-gray-700">Saldo Akun (USD $)</label>
              </div>
              <input
                type="number"
                step="any"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                placeholder="misal: 10 atau 1000"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              {/* Quick Balance Presets */}
              <div className="flex flex-wrap gap-1 mt-1">
                {[10, 50, 100, 500, 1000].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBalance(b)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                      balance === b
                        ? 'bg-excel-green text-white border-excel-green font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    ${b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Risk % & SL Pips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-gray-700">Risiko Akun (%)</label>
                <span className="text-[10px] text-emerald-700 font-bold font-mono">
                  ${result.riskAmount}
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 5].map((pct) => (
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
                placeholder="misal: 20"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[10, 15, 20, 30, 50].map((p) => (
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

          {/* Hasil Perhitungan Lot */}
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 text-center space-y-1.5">
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
              Ukuran Lot yang Disarankan:
            </span>

            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono">
              {result.recommendedLot}
            </div>

            <p className="text-[10px] text-emerald-700">
              Jika SL {slPips} pips tersentuh, kerugian Anda maksimal{' '}
              <strong className="text-rose-700 font-mono">-${result.riskAmount}</strong> ({riskPercent}% dari saldo ${balance})
            </p>
          </div>

          {/* Info Khusus Modal Kecil ($10) */}
          {result.isSmallAccount && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-amber-900 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Solusi Modal $10 (Akun Cent vs Standar):</span>
              </div>
              <p className="leading-relaxed text-[10.5px]">
                {result.brokerMinNote}
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10.5px]">
                <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                  <span className="text-gray-500 block">Akun Standar:</span>
                  <strong>0.01 Lot</strong> (Risk: ${(0.01 * slPips * 1).toFixed(2)})
                </div>
                <div className="bg-emerald-100/80 p-1.5 rounded border border-emerald-300 text-emerald-900 font-bold">
                  <span className="text-emerald-700 block">Akun Cent (USC):</span>
                  <strong>{result.centLots} Cent Lot</strong> (Risk: ${result.riskAmount})
                </div>
              </div>
            </div>
          )}

          {/* Breakdown Spesifikasi Lot */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Matematis Murni</span>
              <strong className="font-mono text-gray-800 text-xs">{result.standardLots} Lot</strong>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Akun Cent</span>
              <strong className="font-mono text-emerald-700 text-xs">{result.centLots} Cent</strong>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
              <span className="text-gray-500 block">Nilai per Pip</span>
              <strong className="font-mono text-gray-800 text-xs">${result.pipValue}</strong>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Disiplin risiko terjaga
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
                  const applied = result.isSmallAccount ? '0.01 Lot' : `${result.standardLots} Lot`;
                  onApplyLot(applied);
                  onClose();
                }}
                className="px-3 py-1.5 bg-excel-green text-white font-bold rounded text-xs hover:bg-excel-darkgreen flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Gunakan {result.isSmallAccount ? '0.01 Lot' : `${result.standardLots} Lot`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
