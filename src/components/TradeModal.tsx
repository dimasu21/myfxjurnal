import React, { useState, useEffect } from 'react';
import { Trade, PositionType, EmotionType } from '../types/trade';
import { calculatePips, calculateRR } from '../utils/calculations';
import { X, Calculator, Sparkles, Check, AlertCircle } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Trade) => void;
  editingTrade: Trade | null;
}

const COMMON_PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'XAU/USD',
  'AUD/USD',
  'USD/CAD',
  'USD/CHF',
  'NZD/USD',
  'EUR/JPY',
  'GBP/JPY',
  'BTC/USD',
];

const COMMON_REASONS = [
  'MA50 Cross + News Positif',
  'RSI Divergence (Lawan Tren)',
  'Breakout Resistance',
  'Breakout Support',
  'Rejection Key Support / Demand',
  'Supply Zone / Resistance Rejection',
  'SMC / Market Structure Break (BoS)',
  'FVG (Fair Value Gap) Fill',
  'Trend Continuation (Pullback)',
];

const EMOTION_OPTIONS: EmotionType[] = [
  'Percaya Diri',
  'Tenang',
  'Disiplin',
  'Ragu/Cemas',
  'FOMO',
  'Revenge Trade',
  'Serakah',
];

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTrade,
}) => {
  const [tanggal, setTanggal] = useState('');
  const [pair, setPair] = useState('EUR/USD');
  const [customPair, setCustomPair] = useState('');
  const [posisi, setPosisi] = useState<PositionType>('BUY');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [lot, setLot] = useState('1%');
  const [pips, setPips] = useState('');
  const [pnl, setPnl] = useState('');
  const [alasan, setAlasan] = useState('');
  const [emosi, setEmosi] = useState<EmotionType>('Tenang');
  const [evaluasi, setEvaluasi] = useState('');

  // Auto-calculated RR
  const [calculatedRR, setCalculatedRR] = useState('-');

  useEffect(() => {
    if (editingTrade) {
      setTanggal(editingTrade.tanggal);
      if (COMMON_PAIRS.includes(editingTrade.pair)) {
        setPair(editingTrade.pair);
        setCustomPair('');
      } else {
        setPair('OTHER');
        setCustomPair(editingTrade.pair);
      }
      setPosisi(editingTrade.posisi);
      setEntry(String(editingTrade.entry || ''));
      setSl(String(editingTrade.sl || ''));
      setTp(String(editingTrade.tp || ''));
      setExitPrice(editingTrade.exitPrice ? String(editingTrade.exitPrice) : '');
      setLot(editingTrade.lot || '1%');
      setPips(String(editingTrade.pips || ''));
      setPnl(editingTrade.pnl !== undefined ? String(editingTrade.pnl) : '');
      setAlasan(editingTrade.alasan || '');
      setEmosi((editingTrade.emosi as EmotionType) || 'Tenang');
      setEvaluasi(editingTrade.evaluasi || '');
    } else {
      // Default new trade
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
        today.getMonth() + 1
      ).padStart(2, '0')}/${today.getFullYear()}`;

      setTanggal(formattedDate);
      setPair('EUR/USD');
      setCustomPair('');
      setPosisi('BUY');
      setEntry('');
      setSl('');
      setTp('');
      setExitPrice('');
      setLot('1%');
      setPips('');
      setPnl('');
      setAlasan('');
      setEmosi('Tenang');
      setEvaluasi('');
    }
  }, [editingTrade, isOpen]);

  // Recalculate RR whenever entry, sl, tp, posisi change
  useEffect(() => {
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(sl);
    const tpNum = parseFloat(tp);
    if (!isNaN(entryNum) && !isNaN(slNum) && !isNaN(tpNum)) {
      setCalculatedRR(calculateRR(posisi, entryNum, slNum, tpNum));
    } else {
      setCalculatedRR('-');
    }
  }, [entry, sl, tp, posisi]);

  // Calculate pips if exit price is filled
  const handleAutoCalculatePips = () => {
    const entryNum = parseFloat(entry);
    const exitNum = parseFloat(exitPrice);
    const activePair = pair === 'OTHER' ? customPair : pair;

    if (!isNaN(entryNum) && !isNaN(exitNum) && activePair) {
      const calculated = calculatePips(activePair, posisi, entryNum, exitNum);
      setPips(String(calculated));
      if (!pnl) {
        setPnl(String(calculated));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activePair = (pair === 'OTHER' ? customPair : pair).trim().toUpperCase();

    if (!activePair) {
      alert('Silakan tentukan pair Forex!');
      return;
    }

    const entryNum = parseFloat(entry) || 0;
    const slNum = parseFloat(sl) || 0;
    const tpNum = parseFloat(tp) || 0;
    const exitNum = exitPrice ? parseFloat(exitPrice) : undefined;
    const pipsNum = parseFloat(pips) || 0;
    const pnlNum = pnl ? parseFloat(pnl) : pipsNum;

    const status = pipsNum > 0 ? 'WIN' : pipsNum < 0 ? 'LOSS' : 'BE';

    const newTrade: Trade = {
      id: editingTrade ? editingTrade.id : `tr-${Date.now()}`,
      tanggal,
      pair: activePair,
      posisi,
      entry: entryNum,
      sl: slNum,
      tp: tpNum,
      exitPrice: exitNum,
      lot,
      pips: pipsNum,
      pnl: pnlNum,
      status,
      alasan: alasan || '-',
      emosi,
      evaluasi: evaluasi || '-',
      riskReward: calculatedRR !== '-' ? calculatedRR : editingTrade?.riskReward || '-',
    };

    onSave(newTrade);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center font-bold text-xs">
              fx
            </div>
            <h3 className="font-bold text-sm sm:text-base">
              {editingTrade ? 'Edit Catatan Trade' : 'Tambah Jurnal Trade Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Row 1: Tanggal & Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tanggal Eksekusi
              </label>
              <input
                type="text"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                placeholder="DD/MM/YYYY (contoh: 19/01/2026)"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono focus:border-excel-green focus:outline-none focus:ring-1 focus:ring-excel-green"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Forex Pair / Aset
              </label>
              <div className="flex gap-1.5">
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-800 focus:border-excel-green focus:outline-none"
                >
                  {COMMON_PAIRS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="OTHER">+ Lainnya (Kustom)</option>
                </select>
              </div>

              {pair === 'OTHER' && (
                <input
                  type="text"
                  placeholder="Contoh: USD/MXN atau XAG/USD"
                  value={customPair}
                  onChange={(e) => setCustomPair(e.target.value)}
                  className="w-full mt-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-bold uppercase focus:border-excel-green focus:outline-none"
                  required
                />
              )}
            </div>
          </div>

          {/* Row 2: Posisi (BUY / SELL) & Lot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Arah Posisi
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPosisi('BUY')}
                  className={`py-1.5 text-xs font-bold rounded border transition-all ${
                    posisi === 'BUY'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-50'
                  }`}
                >
                  🟢 BUY (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setPosisi('SELL')}
                  className={`py-1.5 text-xs font-bold rounded border transition-all ${
                    posisi === 'SELL'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-50'
                  }`}
                >
                  🔴 SELL (Short)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ukuran Lot / Resiko
              </label>
              <input
                type="text"
                value={lot}
                onChange={(e) => setLot(e.target.value)}
                placeholder="contoh: 1% atau 0.1 Lot"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:border-excel-green focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Row 3: Entry, SL, TP */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              <span>Tingkat Harga (Price Levels)</span>
              {calculatedRR !== '-' && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                  Est. R:R = {calculatedRR}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                  Harga Entry *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="misal: 148.50"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs font-mono font-bold focus:border-excel-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-rose-700 mb-0.5">
                  Stop Loss (SL) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="misal: 148.20"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  className="w-full px-2 py-1.5 border border-rose-300 bg-rose-50/30 rounded text-xs font-mono font-bold text-rose-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-emerald-700 mb-0.5">
                  Take Profit (TP) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="misal: 149.10"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  className="w-full px-2 py-1.5 border border-emerald-300 bg-emerald-50/30 rounded text-xs font-mono font-bold text-emerald-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Hasil & Kalkulator Pips Otomatis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Harga Exit (Opsional)
                </label>
                {entry && exitPrice && (
                  <button
                    type="button"
                    onClick={handleAutoCalculatePips}
                    className="text-[11px] text-excel-green hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <Calculator className="w-3 h-3" /> Hitung Pips
                  </button>
                )}
              </div>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="misal: 148.95"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono focus:border-excel-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hasil Akhir (Pips) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  value={pips}
                  onChange={(e) => setPips(e.target.value)}
                  placeholder="contoh: +45 atau -20"
                  className={`w-full px-3 py-1.5 border rounded text-xs font-mono font-extrabold focus:outline-none ${
                    parseFloat(pips) > 0
                      ? 'border-emerald-400 bg-emerald-50/40 text-emerald-800'
                      : parseFloat(pips) < 0
                      ? 'border-rose-400 bg-rose-50/40 text-rose-800'
                      : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-3 top-2 text-[10px] text-gray-500 font-semibold pointer-events-none">
                  PIPS
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Alasan Eksekusi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Alasan Eksekusi (Teknikal / Fundamental)
            </label>
            <input
              type="text"
              list="reason-suggestions"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="contoh: MA50 Cross + News Positif, Breakout Resistance..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:border-excel-green focus:outline-none"
            />
            <datalist id="reason-suggestions">
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          {/* Row 6: Emosi & Psikologi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Emosi / Kondisi Psikologis saat Entry
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {EMOTION_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmosi(em)}
                  className={`py-1 px-2 text-[11px] rounded border text-center transition-all ${
                    emosi === em
                      ? 'bg-excel-green text-white font-bold border-excel-green shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7: Evaluasi Akhir */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Evaluasi Akhir / Pelajaran (Penting untuk Konsistensi)
            </label>
            <textarea
              rows={2}
              value={evaluasi}
              onChange={(e) => setEvaluasi(e.target.value)}
              placeholder="Apa yang dipelajari? Apakah sesuai rencana atau ada FOMO/geser SL?"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:border-excel-green focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-excel-green hover:bg-excel-darkgreen text-white font-bold rounded text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan ke Sheet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

