import React, { useState, useEffect } from 'react';
import { calculateLotSize } from '../utils/forexHelpers';
import { 
  ArrowLeft, 
  Calculator, 
  Coins, 
  ShieldCheck, 
  Info, 
  Check, 
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface LotCalculatorViewProps {
  onBack: () => void;
  onApplyLot?: (calculatedLot: string) => void;
  initialPair?: string;
  initialSlPips?: number;
}

export const LotCalculatorView: React.FC<LotCalculatorViewProps> = ({
  onBack,
  onApplyLot,
  initialPair = 'EUR/USD',
  initialSlPips = 20,
}) => {
  const [balance, setBalance] = useState<number>(10);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [slPips, setSlPips] = useState<number>(initialSlPips || 20);
  const [pair, setPair] = useState<string>(initialPair);
  const [accountType, setAccountType] = useState<'standard' | 'cent'>('standard');
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

  const effectiveBalance = accountType === 'cent' ? balance * 100 : balance;
  const result = calculateLotSize(effectiveBalance, riskPercent, slPips, pair);

  const riskAmount = (balance * (riskPercent / 100)).toFixed(2);
  const target1to1 = slPips;
  const target1to2 = slPips * 2;
  const target1to3 = slPips * 3;

  const handleCopyLot = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(result.recommendedLot);
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
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kalkulator Lot & Manajemen Risiko</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Perhitungan ukuran lot presisi berdasarkan toleransi risiko akun modal kecil ($10) hingga akun besar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyLot && (
            <button
              onClick={() => {
                onApplyLot(result.recommendedLot);
                onBack();
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Terapkan Lot ke Entry
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 space-y-6">
        {/* Responsive Grid: Inputs (Left) and Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Parameters Card (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Parameter Transaksi</h2>
              </div>
              <button
                onClick={() => {
                  setBalance(10);
                  setRiskPercent(1);
                  setSlPips(20);
                  setPair('EUR/USD');
                  setAccountType('standard');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* Account Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Tipe Akun Broker
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('standard')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    accountType === 'standard'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-750'
                  }`}
                >
                  Akun Standar / Mikro (USD)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('cent')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    accountType === 'cent'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-750'
                  }`}
                >
                  Akun Cent (USC Cents)
                </button>
              </div>
            </div>

            {/* Forex Pair */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Instrumen / Pasangan Mata Uang
              </label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="EUR/USD">EUR/USD (Euro / US Dollar)</option>
                <option value="GBP/USD">GBP/USD (Great Britain Pound / US Dollar)</option>
                <option value="USD/JPY">USD/JPY (US Dollar / Japanese Yen)</option>
                <option value="XAU/USD">XAU/USD (Gold Emas Spot)</option>
                <option value="AUD/USD">AUD/USD (Australian Dollar / US Dollar)</option>
                <option value="USD/CAD">USD/CAD (US Dollar / Canadian Dollar)</option>
                <option value="USD/CHF">USD/CHF (US Dollar / Swiss Franc)</option>
                <option value="NZD/USD">NZD/USD (New Zealand Dollar / US Dollar)</option>
                <option value="BTC/USD">BTC/USD (Bitcoin / US Dollar)</option>
              </select>
            </div>

            {/* Saldo Akun */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Saldo Akun ({accountType === 'cent' ? 'USC Cent' : 'USD $'})
                </label>
                <span className="text-[11px] text-gray-400 dark:text-slate-500">Mendukung modal $10</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
                  {accountType === 'cent' ? '¢' : '$'}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[10, 50, 100, 500, 1000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBalance(preset)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Risiko % & Stop Loss */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Toleransi Risiko (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">%</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[0.5, 1, 2, 3].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRiskPercent(r)}
                      className={`flex-1 py-1 text-[11px] font-medium rounded border transition-colors ${
                        riskPercent === r
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Jarak Stop Loss (Pips)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={slPips}
                    onChange={(e) => setSlPips(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">Pips</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[10, 15, 20, 30].map((sl) => (
                    <button
                      key={sl}
                      type="button"
                      onClick={() => setSlPips(sl)}
                      className={`flex-1 py-1 text-[11px] font-medium rounded border transition-colors ${
                        slPips === sl
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {sl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Calculation Results & Money Management (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-emerald-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-300">
                  Rekomendasi Ukuran Posisi
                </span>
                <span className="text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200 font-mono">
                  {pair}
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  {result.recommendedLot}
                </div>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Volume transaksi aman sesuai rasio risiko Anda
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-emerald-300 block text-[11px]">Maksimum Kerugian ($)</span>
                  <span className="text-base font-bold text-white font-mono">
                    ${riskAmount} USD
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-emerald-300 block text-[11px]">Nilai Pip / Lot</span>
                  <span className="text-base font-bold text-white font-mono">
                    ${result.pipValue}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLot}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Lot Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Salin Ukuran Lot</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Risk-Reward Projection Card */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Target Risk-to-Reward (RRR)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700">
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">1:1 TP</div>
                  <div className="text-sm font-bold text-gray-800 dark:text-slate-100 font-mono mt-0.5">{target1to1} pips</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">+${riskAmount}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">1:2 TP (Ideal)</div>
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 font-mono mt-0.5">{target1to2} pips</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">+${(parseFloat(riskAmount) * 2).toFixed(2)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700">
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">1:3 TP</div>
                  <div className="text-sm font-bold text-gray-800 dark:text-slate-100 font-mono mt-0.5">{target1to3} pips</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">+${(parseFloat(riskAmount) * 3).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Note on Small Accounts */}
            {balance <= 50 && accountType === 'standard' && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Tips Akun Mikro / $10:</strong>
                  <span>
                    Jika broker Anda menerapkan batas minimum 0.01 lot, gunakan Akun Cent (USC) agar risiko 1% ($0.10) dapat dihitung dengan presisi tanpa over-leverage.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

