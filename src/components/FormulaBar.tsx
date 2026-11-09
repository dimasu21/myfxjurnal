import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TradeFilter } from '../types/trade';

interface FormulaBarProps {
  selectedCell: string;
  cellValue: string;
  filter: TradeFilter;
  setFilter: React.Dispatch<React.SetStateAction<TradeFilter>>;
  availablePairs: string[];
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  cellValue,
  filter,
  setFilter,
  availablePairs,
}) => {
  return (
    <div className="bg-[#f3f4f6] border-b border-gray-300 px-3 py-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
      {/* Excel Formula Box Section */}
      <div className="flex items-center gap-1.5 flex-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-inner">
        {/* Cell Reference Box (e.g., A1, D3) */}
        <div className="w-12 text-center font-mono font-bold text-gray-700 bg-gray-100 border-r border-gray-300 pr-1 select-none">
          {selectedCell || 'A1'}
        </div>

        {/* fx symbol */}
        <div className="font-serif italic font-bold text-gray-500 px-1 border-r border-gray-200 select-none">
          fx
        </div>

        {/* Cell Content Preview / formula */}
        <div className="flex-1 font-mono text-gray-800 truncate px-1" title={cellValue}>
          {cellValue || '=SUM(H2:H100) — Klik baris/sel untuk melihat data'}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
        {/* Search input */}
        <div className="relative flex-1 sm:w-44">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pair / alasan..."
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-7 pr-6 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-excel-green"
          />
          {filter.search && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
              className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pair */}
        <select
          value={filter.pair}
          onChange={(e) => setFilter((prev) => ({ ...prev, pair: e.target.value }))}
          className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-excel-green"
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
          className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-excel-green font-medium"
        >
          <option value="">Semua Hasil</option>
          <option value="WIN">🟢 WIN</option>
          <option value="LOSS">🔴 LOSS</option>
          <option value="BE">⚪ Break Even</option>
        </select>
      </div>
    </div>
  );
};
