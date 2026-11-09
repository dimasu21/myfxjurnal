import React from 'react';
import { Search, X, Edit3, Trash2 } from 'lucide-react';
import { TradeFilter, Trade, StrategyType } from '../types/trade';

interface FormulaBarProps {
  selectedCell: string;
  cellValue: string;
  selectedTrade: Trade | null;
  onEditSelectedTrade?: () => void;
  onDeleteSelectedTrade?: () => void;
  filter: TradeFilter;
  setFilter: React.Dispatch<React.SetStateAction<TradeFilter>>;
  availablePairs: string[];
}

const STRATEGIES: StrategyType[] = [
  'SMC / Market Structure',
  'Breakout Resistance/Support',
  'SnR / Key Level Rejection',
  'FVG (Fair Value Gap)',
  'Trend Following / Pullback',
  'Reversal / Divergence',
  'Scalping Momentum',
  'News Trading',
  'Lainnya',
];

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  cellValue,
  selectedTrade,
  onEditSelectedTrade,
  onDeleteSelectedTrade,
  filter,
  setFilter,
  availablePairs,
}) => {
  return (
    <div className="bg-[#f3f4f6] dark:bg-[#1e293b] border-b border-gray-300 dark:border-slate-800 px-3 py-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs transition-colors">
      {/* Excel Formula Box Section */}
      <div className="flex items-center gap-1.5 flex-1 bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded px-2 py-1 shadow-inner overflow-hidden">
        {/* Cell Reference Box (e.g., A1, D3) */}
        <div className="w-12 text-center font-mono font-bold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-700 pr-1 select-none shrink-0">
          {selectedCell || 'A1'}
        </div>

        {/* fx symbol */}
        <div className="font-serif italic font-bold text-gray-500 dark:text-slate-400 px-1 border-r border-gray-200 dark:border-slate-700 select-none shrink-0">
          fx
        </div>

        {/* Cell Content Preview / formula */}
        <div className="flex-1 font-mono text-gray-800 dark:text-slate-200 truncate px-1" title={cellValue}>
          {cellValue || '=SUM(H2:H100) — Klik baris untuk memilih sel (Double-click untuk Edit)'}
        </div>

        {/* Quick Row Actions when a trade row is selected */}
        {selectedTrade && (
          <div className="flex items-center gap-1 shrink-0 border-l border-gray-200 dark:border-slate-700 pl-1.5">
            <button
              onClick={onEditSelectedTrade}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium text-[11px] transition-colors"
              title="Edit baris yang dipilih"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={onDeleteSelectedTrade}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-medium text-[11px] transition-colors"
              title="Hapus baris yang dipilih (bisa juga tekan tombol Delete)"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
        {/* Search input */}
        <div className="relative flex-1 sm:w-40">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Cari pair / alasan..."
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-7 pr-6 py-1 bg-white dark:bg-[#0f172a] text-gray-800 dark:text-slate-100 border border-gray-300 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-excel-green"
          />
          {filter.search && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
              className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pair */}
        <select
          value={filter.pair}
          onChange={(e) => setFilter((prev) => ({ ...prev, pair: e.target.value }))}
          className="bg-white dark:bg-[#0f172a] text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-excel-green"
        >
          <option value="">Semua Pair</option>
          {availablePairs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Filter Status */}
        <select
          value={filter.status}
          onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
          className="bg-white dark:bg-[#0f172a] text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-excel-green font-medium"
        >
          <option value="">Semua Hasil</option>
          <option value="WIN">🟢 WIN</option>
          <option value="LOSS">🔴 LOSS</option>
          <option value="BE">⚪ Break Even</option>
        </select>

        {/* Filter Strategi (Fitur #8) */}
        <select
          value={filter.strategi || ''}
          onChange={(e) => setFilter((prev) => ({ ...prev, strategi: e.target.value }))}
          className="bg-white dark:bg-[#0f172a] text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-excel-green"
        >
          <option value="">Semua Strategi</option>
          {STRATEGIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
