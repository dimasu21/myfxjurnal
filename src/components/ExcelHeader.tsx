import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Plus, 
  RotateCcw, 
  BarChart3, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ExcelHeaderProps {
  onOpenNewModal: () => void;
  onOpenAnalytics: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onImportClick: () => void;
  onResetSample: () => void;
  activeView: 'table' | 'cards';
  setActiveView: (view: 'table' | 'cards') => void;
  totalTrades: number;
}

export const ExcelHeader: React.FC<ExcelHeaderProps> = ({
  onOpenNewModal,
  onOpenAnalytics,
  onExportExcel,
  onExportCsv,
  onImportClick,
  onResetSample,
  activeView,
  setActiveView,
  totalTrades
}) => {
  return (
    <header className="bg-excel-green text-white shadow-md select-none sticky top-0 z-30">
      {/* Top Title Bar ala Excel */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-emerald-800 text-xs sm:text-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-white/20 p-1 rounded flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-wide truncate">
            Jurnal_Trading_Forex.xlsx
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Auto-Save Aktif
          </span>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* View Toggle on Mobile */}
          <div className="flex bg-emerald-900/70 p-0.5 rounded text-xs">
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeView === 'table' ? 'bg-white text-excel-green font-bold shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
              title="Tampilan Tabel Excel"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sheet Excel</span>
            </button>
            <button
              onClick={() => setActiveView('cards')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeView === 'cards' ? 'bg-white text-excel-green font-bold shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
              title="Tampilan Kartu Ringkas (Cocok di HP)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Kartu HP</span>
            </button>
          </div>

          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-3 py-1.5 rounded text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">+ Entry Baru</span>
          </button>
        </div>
      </div>

      {/* Excel Ribbon Quick Action Bar */}
      <div className="bg-[#0e6b37] px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-yellow-300" />
            <span>Tambah Baris</span>
          </button>

          <div className="w-[1px] h-4 bg-emerald-700 mx-1" />

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Statistik & Emosi</span>
          </button>

          <div className="w-[1px] h-4 bg-emerald-700 mx-1" />

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Download file Excel .xlsx"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>Export .XLSX</span>
          </button>

          <button
            onClick={onExportCsv}
            className="hidden sm:flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>CSV</span>
          </button>

          <button
            onClick={onImportClick}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Import data Excel atau CSV"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-200" />
            <span>Import</span>
          </button>

          <div className="w-[1px] h-4 bg-emerald-700 mx-1" />

          <button
            onClick={onResetSample}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors"
            title="Kembalikan data ke contoh awal"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Contoh</span>
          </button>
        </div>

        <div className="text-[11px] text-emerald-200 shrink-0 font-mono">
          Total Baris: <strong className="text-white">{totalTrades}</strong>
        </div>
      </div>
    </header>
  );
};

