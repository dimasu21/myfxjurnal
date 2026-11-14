import React, { useState, useEffect, useMemo } from 'react';
import { Trade, PositionType } from '../types/trade';
import { UserAccount } from '../types/user';
import { ForexTicker } from '../types/realtime';
import { 
  ArrowLeft, 
  Calculator, 
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface LotCalculatorViewProps {
  onBack: () => void;
  trades?: Trade[];
  tickers?: ForexTicker[];
  user?: UserAccount | null;
  onApplyToTrade?: (prefill: {
    pair: string;
    posisi: PositionType;
    entry: number;
    sl: number;
    tp: number;
    lot: string;
    riskReward?: string;
  }) => void;
}

const AVAILABLE_PAIRS = [
  { pair: 'XAU/USD', name: 'Gold (Emas Spot USD)', digits: 2, pipSize: 0.1, category: 'commodity' },
  { pair: 'EUR/USD', name: 'Euro / US Dollar', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'GBP/USD', name: 'British Pound / US Dollar', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'USD/JPY', name: 'US Dollar / Japanese Yen', digits: 3, pipSize: 0.01, category: 'jpy' },
  { pair: 'AUD/USD', name: 'Australian Dollar / USD', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'USD/CAD', name: 'US Dollar / Canadian Dollar', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'USD/CHF', name: 'US Dollar / Swiss Franc', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'NZD/USD', name: 'New Zealand Dollar / USD', digits: 5, pipSize: 0.0001, category: 'forex' },
  { pair: 'EUR/JPY', name: 'Euro / Japanese Yen', digits: 3, pipSize: 0.01, category: 'jpy' },
  { pair: 'GBP/JPY', name: 'British Pound / Japanese Yen', digits: 3, pipSize: 0.01, category: 'jpy' },
  { pair: 'BTC/USD', name: 'Bitcoin / US Dollar', digits: 1, pipSize: 1.0, category: 'crypto' },
];

export const LotCalculatorView: React.FC<LotCalculatorViewProps> = ({
  onBack,
  trades = [],
  tickers = [],
  user = null,
  onApplyToTrade,
}) => {
  // Hitung saldo riil dari akun jurnal
  const journalBalance = useMemo(() => {
    const totalPnL = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
    const initial = user?.initialBalance || 0;
    const finalBalance = initial + totalPnL;
    return finalBalance > 0 ? parseFloat(finalBalance.toFixed(2)) : 1000;
  }, [trades, user]);

  // State Parameter
  const [pair, setPair] = useState<string>('XAU/USD');
  const [posisi, setPosisi] = useState<PositionType>('BUY');
  const [calcMode, setCalcMode] = useState<'price' | 'pips'>('price');
  const [riskMode, setRiskMode] = useState<'percent' | 'usd'>('percent');
  const [balance, setBalance] = useState<number>(journalBalance);
  const [accountType, setAccountType] = useState<'standard' | 'cent'>('standard');
  const [leverage, setLeverage] = useState<number>(500);

  // Parameter Harga & Pips
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [slPrice, setSlPrice] = useState<string>('');
  const [customSlPips, setCustomSlPips] = useState<number>(30);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [riskUsd, setRiskUsd] = useState<number>(10);

  // Deteksi Ticker Live
  const currentTicker = useMemo(() => {
    return tickers.find((t) => t.pair.toUpperCase() === pair.toUpperCase()) || null;
  }, [tickers, pair]);

  // Info Pair
  const pairInfo = useMemo(() => {
    return AVAILABLE_PAIRS.find((p) => p.pair === pair) || AVAILABLE_PAIRS[0];
  }, [pair]);

  // Update Entry Price otomatis saat ganti pair jika ada ticker live
  useEffect(() => {
    if (currentTicker && !entryPrice) {
      setEntryPrice(String(posisi === 'BUY' ? currentTicker.ask : currentTicker.bid));
    }
  }, [pair, currentTicker]);

  // Update Balance jika journalBalance berubah
  useEffect(() => {
    if (journalBalance > 0) {
      setBalance(journalBalance);
    }
  }, [journalBalance]);

  // Tombol Ambil Harga Pasar Saat Ini
  const handleUseCurrentMarketPrice = () => {
    if (currentTicker) {
      const price = posisi === 'BUY' ? currentTicker.ask : currentTicker.bid;
      setEntryPrice(String(price));
      
      // Berikan estimasi SL otomatis (misal 30 pips di bawah/atas harga)
      const diff = 30 * pairInfo.pipSize;
      const estimatedSl = posisi === 'BUY' ? price - diff : price + diff;
      setSlPrice(estimatedSl.toFixed(pairInfo.digits));
    }
  };

  // Keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // ==============================================================
  // KALKULASI UTAMA (FINANSIAL RIIL & PRESISI)
  // ==============================================================
  const calculation = useMemo(() => {
    const effectiveBalance = accountType === 'cent' ? balance * 100 : balance;

    // 1. Tentukan Uang yang Diresikokan ($ Risk)
    let calculatedRiskAmount = 0;
    let calculatedRiskPct = 0;

    if (riskMode === 'percent') {
      calculatedRiskPct = Math.max(0.01, riskPercent);
      calculatedRiskAmount = (effectiveBalance * calculatedRiskPct) / 100;
    } else {
      calculatedRiskAmount = Math.max(0.1, riskUsd);
      calculatedRiskPct = (calculatedRiskAmount / effectiveBalance) * 100;
    }

    // 2. Tentukan Jarak Stop Loss dalam Pips
    let calculatedPips = 0;
    const entryNum = parseFloat(entryPrice) || 0;
    const slNum = parseFloat(slPrice) || 0;

    if (calcMode === 'price') {
      if (entryNum > 0 && slNum > 0) {
        const rawDistance = Math.abs(entryNum - slNum);
        calculatedPips = rawDistance / pairInfo.pipSize;
      } else {
        calculatedPips = 30; // default jika belum diinput
      }
    } else {
      calculatedPips = Math.max(1, customSlPips);
    }

    // 3. Nilai Pip per 1 Standard Lot (100,000 units)
    let pipValuePerStandardLot = 10; // Default EUR/USD dsb.
    const cleanPair = pair.toUpperCase();

    if (pairInfo.category === 'jpy') {
      const liveJpyRate = currentTicker?.bid || (cleanPair.includes('USD') ? 154 : 160);
      pipValuePerStandardLot = (pairInfo.pipSize / liveJpyRate) * 100000;
    } else if (pairInfo.category === 'commodity') {
      // XAU/USD: 1 lot = 100 oz. 0.10 price move = $10 / lot
      pipValuePerStandardLot = 10;
    } else if (pairInfo.category === 'crypto') {
      // BTC/USD: 1 lot = 1 BTC. $1 move = $1 / lot
      pipValuePerStandardLot = 1;
    }

    // 4. Hitung Ukuran Lot Matematis
    const rawLots = calculatedPips > 0 && pipValuePerStandardLot > 0
      ? calculatedRiskAmount / (calculatedPips * pipValuePerStandardLot)
      : 0.01;

    // Standard Lot (dibulatkan ke 2 desimal standar broker, min 0.01)
    const standardLotFormatted = rawLots < 0.01 ? 0.01 : parseFloat(rawLots.toFixed(2));
    const rawLotPrecision = parseFloat(rawLots.toFixed(4));

    // Kontrak / Units
    const units = Math.round(standardLotFormatted * (pairInfo.category === 'commodity' ? 100 : 100000));

    // Kebutuhan Margin Estimasi
    const basePrice = entryNum > 0 ? entryNum : (currentTicker?.bid || 1);
    const notionalValue = standardLotFormatted * (pairInfo.category === 'commodity' ? 100 * basePrice : 100000 * (cleanPair.startsWith('USD') ? 1 : basePrice));
    const requiredMargin = leverage > 0 ? notionalValue / leverage : notionalValue / 100;

    // Total Nilai Pip per Transaksi ($/pip)
    const activePipValue = standardLotFormatted * pipValuePerStandardLot;

    // Target Harga Take Profit (1:1, 1:2, 1:3)
    const pipDist = calculatedPips * pairInfo.pipSize;
    const tp1Price = entryNum > 0 ? (posisi === 'BUY' ? entryNum + pipDist : entryNum - pipDist) : 0;
    const tp2Price = entryNum > 0 ? (posisi === 'BUY' ? entryNum + (pipDist * 2) : entryNum - (pipDist * 2)) : 0;
    const tp3Price = entryNum > 0 ? (posisi === 'BUY' ? entryNum + (pipDist * 3) : entryNum - (pipDist * 3)) : 0;

    // Cek Peringatan Risiko
    const isMicroWarning = rawLots < 0.01;
    const isMarginWarning = requiredMargin > effectiveBalance;
    const isHighRiskWarning = calculatedRiskPct > 5;

    return {
      riskAmount: calculatedRiskAmount,
      riskPercent: calculatedRiskPct,
      pips: parseFloat(calculatedPips.toFixed(1)),
      standardLot: standardLotFormatted,
      rawLotPrecision,
      units,
      pipValuePerLot: parseFloat(pipValuePerStandardLot.toFixed(2)),
      activePipValue: parseFloat(activePipValue.toFixed(2)),
      requiredMargin: parseFloat(requiredMargin.toFixed(2)),
      tp1Price: tp1Price > 0 ? tp1Price.toFixed(pairInfo.digits) : '-',
      tp2Price: tp2Price > 0 ? tp2Price.toFixed(pairInfo.digits) : '-',
      tp3Price: tp3Price > 0 ? tp3Price.toFixed(pairInfo.digits) : '-',
      isMicroWarning,
      isMarginWarning,
      isHighRiskWarning,
    };
  }, [
    balance,
    accountType,
    riskMode,
    riskPercent,
    riskUsd,
    calcMode,
    entryPrice,
    slPrice,
    customSlPips,
    pair,
    pairInfo,
    currentTicker,
    leverage,
    posisi
  ]);

  // Handler Terapkan ke Jurnal Trading (Actionable Workflow)
  const handleApplyTrade = () => {
    if (onApplyToTrade) {
      const entryNum = parseFloat(entryPrice) || (currentTicker?.bid || 0);
      const slNum = parseFloat(slPrice) || (posisi === 'BUY' ? entryNum - 0.0030 : entryNum + 0.0030);
      const tpNum = parseFloat(calculation.tp2Price) || (posisi === 'BUY' ? entryNum + 0.0060 : entryNum - 0.0060);

      onApplyToTrade({
        pair,
        posisi,
        entry: entryNum,
        sl: slNum,
        tp: tpNum,
        lot: `${calculation.standardLot}`,
        riskReward: '1:2',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-800 dark:text-slate-100 overflow-y-auto">
      {/* Top Bar Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Kembali ke Jurnal (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div className="h-4 w-[1px] bg-gray-300 dark:bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#107c41] dark:text-emerald-400" />
              <span>Kalkulator Ukuran Lot & Manajemen Risiko</span>
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 hidden sm:block">
              Perhitungan ukuran posisi otomatis tersinkronisasi dengan saldo akun jurnal & harga pasar riil
            </p>
          </div>
        </div>

        {/* Live Ticker Pill */}
        {currentTicker && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-900 dark:text-emerald-300">{pair}</span>
            <span className="text-gray-900 dark:text-white font-bold">{currentTicker.bid.toFixed(pairInfo.digits)}</span>
          </div>
        )}
      </div>

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ============================================================ */}
          {/* KOLOM KIRI: INPUT PARAMETER (7 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#107c41] dark:text-emerald-400" />
                <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Parameter Transaksi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBalance(journalBalance);
                  setRiskMode('percent');
                  setRiskPercent(1.0);
                  setCalcMode('price');
                  setEntryPrice('');
                  setSlPrice('');
                  setCustomSlPips(30);
                  setPosisi('BUY');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Nilai</span>
              </button>
            </div>

            {/* 1. Instrumen & Arah Posisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Instrumen Pasangan
                </label>
                <select
                  value={pair}
                  onChange={(e) => {
                    setPair(e.target.value);
                    setEntryPrice('');
                    setSlPrice('');
                  }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {AVAILABLE_PAIRS.map((p) => (
                    <option key={p.pair} value={p.pair}>
                      {p.pair} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Arah Posisi
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPosisi('BUY')}
                    className={`py-2 px-3 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      posisi === 'BUY'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>BUY (Long)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosisi('SELL')}
                    className={`py-2 px-3 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      posisi === 'SELL'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>SELL (Short)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Saldo Akun (Tersinkronisasi Jurnal) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Saldo Akun Trading ($ USD)
                </label>
                {balance !== journalBalance && (
                  <button
                    type="button"
                    onClick={() => setBalance(journalBalance)}
                    className="text-[11px] text-[#107c41] dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Gunakan Saldo Jurnal (${journalBalance.toFixed(2)})
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Preset Saldo Cepat */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[50, 100, 500, 1000, 2500, 5000, 10000].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBalance(b)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border transition-colors cursor-pointer ${
                      balance === b
                        ? 'bg-[#107c41] text-white border-[#107c41]'
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100'
                    }`}
                  >
                    ${b}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Pengaturan Risiko (% vs $) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Besaran Risiko per Trade
                </label>
                <div className="flex rounded border border-gray-200 dark:border-slate-700 overflow-hidden text-[11px]">
                  <button
                    type="button"
                    onClick={() => setRiskMode('percent')}
                    className={`px-2.5 py-0.5 font-bold transition-colors cursor-pointer ${
                      riskMode === 'percent'
                        ? 'bg-[#107c41] text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Persentase (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskMode('usd')}
                    className={`px-2.5 py-0.5 font-bold transition-colors cursor-pointer ${
                      riskMode === 'usd'
                        ? 'bg-[#107c41] text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Nominal ($ USD)
                  </button>
                </div>
              </div>

              {riskMode === 'percent' ? (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.5"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[0.5, 1.0, 1.5, 2.0, 3.0].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setRiskPercent(pct)}
                        className={`flex-1 py-1 rounded text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                          riskPercent === pct
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-600'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={riskUsd}
                    onChange={(e) => setRiskUsd(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* 4. Mode Input Stop Loss (Harga vs Pips) */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Metode Penentuan Stop Loss
                </span>
                <div className="flex rounded border border-gray-200 dark:border-slate-700 overflow-hidden text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCalcMode('price')}
                    className={`px-2.5 py-0.5 font-bold transition-colors cursor-pointer ${
                      calcMode === 'price'
                        ? 'bg-[#107c41] text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Level Harga (Entry & SL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcMode('pips')}
                    className={`px-2.5 py-0.5 font-bold transition-colors cursor-pointer ${
                      calcMode === 'pips'
                        ? 'bg-[#107c41] text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Jarak Pips Langsung
                  </button>
                </div>
              </div>

              {calcMode === 'price' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                          Harga Entry
                        </label>
                        {currentTicker && (
                          <button
                            type="button"
                            onClick={handleUseCurrentMarketPrice}
                            className="text-[10px] text-[#107c41] dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            <span>Ambil Harga Pasar</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder={`misal: ${currentTicker ? currentTicker.bid : '1.08500'}`}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        Harga Stop Loss
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={slPrice}
                        onChange={(e) => setSlPrice(e.target.value)}
                        placeholder="misal: harga batas risiko"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500 dark:text-slate-400">Jarak Stop Loss Dihitung:</span>
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {calculation.pips} Pips
                    </strong>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customSlPips}
                      onChange={(e) => setCustomSlPips(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Pips</span>
                  </div>

                  {/* Presets Pips */}
                  <div className="flex gap-1.5 mt-2">
                    {[15, 20, 25, 30, 50, 100].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCustomSlPips(p)}
                        className={`flex-1 py-1 rounded text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                          customSlPips === p
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-600'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Tipe Akun & Leverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Tipe Akun Broker
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccountType('standard')}
                    className={`py-1.5 px-2 rounded border font-semibold text-center cursor-pointer transition-colors ${
                      accountType === 'standard'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Standar (USD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('cent')}
                    className={`py-1.5 px-2 rounded border font-semibold text-center cursor-pointer transition-colors ${
                      accountType === 'cent'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Cent (USC)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Leverage Broker
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="100">1:100</option>
                  <option value="200">1:200</option>
                  <option value="500">1:500 (Standar Retail)</option>
                  <option value="1000">1:1000</option>
                  <option value="2000">1:2000</option>
                </select>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* KOLOM KANAN: HASIL PERHITUNGAN & AKSI EKSEKUSI (5 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Kartu Utama Hasil Ukuran Lot */}
            <div className="bg-[#107c41] text-white rounded-lg p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-100">
                  Ukuran Posisi Direkomendasikan
                </span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono font-bold">
                  {pair} • {posisi}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                    {calculation.standardLot}
                  </span>
                  <span className="text-sm font-semibold text-emerald-200">
                    Lot Standar
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1">
                  {calculation.units.toLocaleString()} Kontrak Unit • Nilai Pip: ${calculation.activePipValue}/pip
                </p>
              </div>

              {/* Rincian Finansial Cepat */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs">
                <div className="bg-black/15 rounded p-2.5">
                  <span className="text-emerald-200 block text-[10px] uppercase font-semibold">Maksimal Risiko</span>
                  <span className="text-base font-bold font-mono text-white mt-0.5 block">
                    ${calculation.riskAmount.toFixed(2)} USD
                  </span>
                  <span className="text-[10px] text-emerald-300">({calculation.riskPercent.toFixed(1)}% saldo)</span>
                </div>

                <div className="bg-black/15 rounded p-2.5">
                  <span className="text-emerald-200 block text-[10px] uppercase font-semibold">Margin Dibutuhkan</span>
                  <span className="text-base font-bold font-mono text-white mt-0.5 block">
                    ${calculation.requiredMargin.toFixed(2)} USD
                  </span>
                  <span className="text-[10px] text-emerald-300">(pada 1:{leverage})</span>
                </div>
              </div>

              {/* ACTIONABLE BUTTON: TERAPKAN KE JURNAL LANGSUNG */}
              <button
                type="button"
                onClick={handleApplyTrade}
                className="w-full py-3 bg-white hover:bg-gray-100 text-[#107c41] font-bold rounded text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-4 h-4 text-[#107c41]" />
                <span>Terapkan ke Jurnal & Buat Entri</span>
                <ArrowRight className="w-4 h-4 text-[#107c41]" />
              </button>
            </div>

            {/* Peringatan Manajemen Risiko Dinamis */}
            {calculation.isMicroWarning && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Akun Mikro / Lot Sangat Kecil:</strong> Lot matematis Anda adalah <strong>{calculation.rawLotPrecision} Lot</strong>. Minimum order broker standar adalah 0.01 Lot ($0.10/pip). Pertimbangkan menggunakan <strong>Akun Cent</strong> agar risiko tetap presisi ${calculation.riskAmount.toFixed(2)}.
                </div>
              </div>
            )}

            {calculation.isHighRiskWarning && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Peringatan Risiko Tinggi:</strong> Risiko {calculation.riskPercent.toFixed(1)}% berada di atas rekomendasi batas aman (1-2%). Disarankan memperkecil risiko agar akun terlindung dari drawdown beruntun.
                </div>
              </div>
            )}

            {/* Target Proyeksi Take Profit (RRR) */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Target Proyeksi Risk-Reward (RRR)
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">SL: {calculation.pips} Pips</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <div className="text-[10px] text-gray-500 font-semibold">1:1 Target</div>
                  <div className="text-xs font-bold font-mono text-gray-900 dark:text-white mt-0.5">
                    {calculation.tp1Price}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-mono font-bold mt-1">
                    +${calculation.riskAmount.toFixed(2)}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">1:2 Target (Ideal)</div>
                  <div className="text-xs font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
                    {calculation.tp2Price}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
                    +${(calculation.riskAmount * 2).toFixed(2)}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <div className="text-[10px] text-gray-500 font-semibold">1:3 Target</div>
                  <div className="text-xs font-bold font-mono text-gray-900 dark:text-white mt-0.5">
                    {calculation.tp3Price}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-mono font-bold mt-1">
                    +${(calculation.riskAmount * 3).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Rangkuman Spesifikasi Pip */}
            <div className="p-3 rounded bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Nilai 1 Pip per 1.00 Lot:</span>
                <strong className="text-gray-900 dark:text-white">${calculation.pipValuePerLot} USD</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Nilai Pip Posisi Ini:</span>
                <strong className="text-gray-900 dark:text-white">${calculation.activePipValue} USD/pip</strong>
              </div>
              <div className="flex justify-between">
                <span>Margin Bebas Minimum:</span>
                <strong className="text-gray-900 dark:text-white">${calculation.requiredMargin} USD</strong>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
