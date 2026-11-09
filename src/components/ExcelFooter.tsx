import React from 'react';
import { Plus, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { Trade } from '../types/trade';

interface ExcelFooterProps {
  activeSheet: 'all' | 'win' | 'loss' | 'summary';
  setActiveSheet: (sheet: 'all' | 'win' | 'loss' | 'summary') => void;
  filteredTrades: Trade[];
}

export const ExcelFooter: React.FC<ExcelFooterProps> = ({
  activeSheet,
  setActiveSheet,
  filteredTrades,
}) => {
  const count = filteredTrades.length;
  const sumPips = filteredTrades.reduce((acc, t) => acc + (Number(t.pips) || 0), 0);
  const avgPips = count > 0 ? (sumPips / count).toFixed(1) : 0;

  return (
    <footer className="bg-[#e9ecef] border-t border-gray-300 text-xs text-gray-700 select-none sticky bottom-0 z-20">
      {/* Sheet Tabs Bar ala Excel */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300 bg-[#f1f3f5] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 shrink-0">
          {/* Nav arrows */}
          <div className="flex text-gray-500 mr-1">
            <button className="p-0.5 hover:text-gray-800 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-0.5 hover:text-gray-800 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sheet 1: Semua Trade */}
          <button
            onClick={() => setActiveSheet('all')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 ${
              activeSheet === 'all'
                ? 'bg-white text-excel-green border-t-excel-green shadow-xs'
                : 'text-gray-600 border-t-transparent hover:bg-gray-200'
            }`}
          >
            📊 Sheet1 - Semua ({count})
          </button>

          {/* Sheet 2: Win Trades */}
          <button
            onClick={() => setActiveSheet('win')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 ${
              activeSheet === 'win'
                ? 'bg-white text-emerald-700 border-t-emerald-600 shadow-xs'
                : 'text-gray-600 border-t-transparent hover:bg-gray-200'
            }`}
          >
            🟢 Win Only
          </button>

          {/* Sheet 3: Loss Trades */}
          <button
            onClick={() => setActiveSheet('loss')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 ${
              activeSheet === 'loss'
                ? 'bg-white text-rose-700 border-t-rose-600 shadow-xs'
                : 'text-gray-600 border-t-transparent hover:bg-gray-200'
            }`}
          >
            🔴 Loss Only
          </button>

          {/* Sheet 4: Summary & Analytics */}
          <button
            onClick={() => setActiveSheet('summary')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 ${
              activeSheet === 'summary'
                ? 'bg-white text-blue-700 border-t-blue-600 shadow-xs'
                : 'text-gray-600 border-t-transparent hover:bg-gray-200'
            }`}
          >
            📈 Analisis Psikologi
          </button>

          {/* Add Sheet Button */}
          <button
            onClick={() => alert('Mode Sheet baru: Anda bisa memfilter dengan tombol sheet di atas!')}
            className="p-1 hover:bg-gray-300 rounded text-gray-500 ml-1"
            title="Tambah Lembar Baru"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Excel Status Bar (Ready, Count, Average, Sum) */}
      <div className="px-3 py-1 flex items-center justify-between text-[11px] text-gray-600 bg-[#e4e7ea]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-excel-darkgreen flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            READY
          </span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="hidden sm:inline">Normal View</span>
        </div>

        {/* Live Calculation ala Excel Status Bar */}
        <div className="flex items-center gap-3 font-mono">
          <span>
            COUNT: <strong className="text-gray-900">{count}</strong>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            AVERAGE:{' '}
            <strong className={Number(avgPips) >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
              {Number(avgPips) > 0 ? `+${avgPips}` : avgPips} Pips
            </strong>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            SUM:{' '}
            <strong className={sumPips >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
              {sumPips > 0 ? `+${sumPips}` : sumPips} Pips
            </strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
