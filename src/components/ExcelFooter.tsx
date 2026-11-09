import React from 'react';
import { Plus, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import { Trade } from '../types/trade';

interface ExcelFooterProps {
  activeSheet: 'all' | 'win' | 'loss' | 'summary' | 'history';
  setActiveSheet: (sheet: 'all' | 'win' | 'loss' | 'summary' | 'history') => void;
  filteredTrades: Trade[];
  totalArchivedMonths?: number;
}

export const ExcelFooter: React.FC<ExcelFooterProps> = ({
  activeSheet,
  setActiveSheet,
  filteredTrades,
  totalArchivedMonths = 0,
}) => {
  const count = filteredTrades.length;
  const sumPips = filteredTrades.reduce((acc, t) => acc + (Number(t.pips) || 0), 0);
  const avgPips = count > 0 ? (sumPips / count).toFixed(1) : 0;

  return (
    <footer className="bg-[#e9ecef] dark:bg-[#1e293b] border-t border-gray-300 dark:border-slate-800 text-xs text-gray-700 dark:text-slate-300 select-none sticky bottom-0 z-20 transition-colors">
      {/* Sheet Tabs Bar ala Excel */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300 dark:border-slate-800 bg-[#f1f3f5] dark:bg-[#0f172a] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 shrink-0">
          {/* Nav arrows */}
          <div className="flex text-gray-500 dark:text-slate-400 mr-1">
            <button className="p-0.5 hover:text-gray-800 dark:hover:text-slate-200 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-0.5 hover:text-gray-800 dark:hover:text-slate-200 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sheet 1: Semua Trade */}
          <button
            onClick={() => setActiveSheet('all')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 ${
              activeSheet === 'all'
                ? 'bg-white dark:bg-[#1e293b] text-excel-green dark:text-emerald-400 border-t-excel-green shadow-xs'
                : 'text-gray-600 dark:text-slate-400 border-t-transparent hover:bg-gray-200 dark:hover:bg-slate-800'
            }`}
          >
            Sheet1 - Semua ({count})
          </button>

          {/* Sheet 2: Win Trades */}
          <button
            onClick={() => setActiveSheet('win')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 flex items-center gap-1.5 ${
              activeSheet === 'win'
                ? 'bg-white dark:bg-[#1e293b] text-emerald-700 dark:text-emerald-400 border-t-emerald-600 shadow-xs'
                : 'text-gray-600 dark:text-slate-400 border-t-transparent hover:bg-gray-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>Win Only</span>
          </button>

          {/* Sheet 3: Loss Trades */}
          <button
            onClick={() => setActiveSheet('loss')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 flex items-center gap-1.5 ${
              activeSheet === 'loss'
                ? 'bg-white dark:bg-[#1e293b] text-rose-700 dark:text-rose-400 border-t-rose-600 shadow-xs'
                : 'text-gray-600 dark:text-slate-400 border-t-transparent hover:bg-gray-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
            <span>Loss Only</span>
          </button>

          {/* Sheet 4: Summary & Analytics */}
          <button
            onClick={() => setActiveSheet('summary')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 flex items-center gap-1.5 ${
              activeSheet === 'summary'
                ? 'bg-white dark:bg-[#1e293b] text-blue-700 dark:text-blue-400 border-t-blue-600 shadow-xs'
                : 'text-gray-600 dark:text-slate-400 border-t-transparent hover:bg-gray-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>Analisis Psikologi</span>
          </button>

          {/* Sheet 5: History Jurnal Bulanan */}
          <button
            onClick={() => setActiveSheet('history')}
            className={`px-3 py-1 font-semibold text-xs rounded-t transition-all border-t-2 flex items-center gap-1.5 ${
              activeSheet === 'history'
                ? 'bg-white dark:bg-[#1e293b] text-purple-700 dark:text-purple-400 border-t-purple-600 shadow-xs font-bold'
                : 'text-gray-600 dark:text-slate-400 border-t-transparent hover:bg-gray-200 dark:hover:bg-slate-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>History Bulanan {totalArchivedMonths > 0 ? `(${totalArchivedMonths})` : ''}</span>
          </button>

          {/* Add Sheet Button */}
          <button
            onClick={() => setActiveSheet('history')}
            className="p-1 hover:bg-gray-300 dark:hover:bg-slate-800 rounded text-gray-500 dark:text-slate-400 ml-1 transition-colors"
            title="Tambah atau buka Arsip History Bulanan"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Excel Status Bar (Ready, Count, Average, Sum) */}
      <div className="px-3 py-1 flex items-center justify-between text-[11px] text-gray-600 dark:text-slate-400 bg-[#e4e7ea] dark:bg-[#0b1120]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-excel-darkgreen dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse"></span>
            READY
          </span>
          <span className="hidden sm:inline text-gray-400 dark:text-slate-600">|</span>
          <span className="hidden sm:inline">Normal View</span>
        </div>

        {/* Live Calculation ala Excel Status Bar */}
        <div className="flex items-center gap-3 font-mono">
          <span>
            COUNT: <strong className="text-gray-900 dark:text-slate-100">{count}</strong>
          </span>
          <span className="text-gray-400 dark:text-slate-600">|</span>
          <span>
            AVERAGE:{' '}
            <strong className={Number(avgPips) >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
              {Number(avgPips) > 0 ? `+${avgPips}` : avgPips} Pips
            </strong>
          </span>
          <span className="text-gray-400 dark:text-slate-600">|</span>
          <span>
            SUM:{' '}
            <strong className={sumPips >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
              {sumPips > 0 ? `+${sumPips}` : sumPips} Pips
            </strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
