import React, { useState } from 'react';
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Calculator, 
  Menu as MenuIcon, 
  X,
  LayoutGrid,
  TrendingUp,
  CandlestickChart,
  Download,
  Archive,
  Sun,
  Moon,
  Save,
  Table as TableIcon,
  FileSpreadsheet,
  FileText,
  Upload,
  Database,
  Trash2
} from 'lucide-react';

interface MobileBottomNavProps {
  activePageView: string;
  setActivePageView: (view: any) => void;
  activeView: 'table' | 'cards';
  setActiveView: (view: 'table' | 'cards') => void;
  onOpenNewModal: () => void;
  onManualSave: () => void;
  hasUnsavedChanges: boolean;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onExportBackupJson: () => void;
  onImportClick: () => void;
  onImportJsonClick: () => void;
  onClearAll: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  totalArchivedMonths: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePageView,
  setActivePageView,
  activeView,
  setActiveView,
  onOpenNewModal,
  onManualSave,
  hasUnsavedChanges,
  onExportExcel,
  onExportPdf,
  onExportCsv,
  onExportBackupJson,
  onImportClick,
  onImportJsonClick,
  onClearAll,
  isDarkMode,
  onToggleDarkMode,
  totalArchivedMonths,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (viewName: string) => {
    setIsMenuOpen(false);
    setActivePageView(viewName);
  };

  return (
    <>
      {/* PERSISTENT BOTTOM NAVIGATION BAR ALA MYFXBOOK MOBILE (THUMB ZONE) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-slate-800 flex items-center justify-around py-1 px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] select-none">
        {/* Tab 1: Jurnal / Portofolio */}
        <button
          onClick={() => handleNavClick('sheet')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors flex-1 ${
            activePageView === 'sheet'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Jurnal</span>
        </button>

        {/* Tab 2: Statistik / Myfxbook Stats */}
        <button
          onClick={() => handleNavClick('analytics')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors flex-1 ${
            activePageView === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Statistik</span>
        </button>

        {/* Tab 3: Kalender News */}
        <button
          onClick={() => handleNavClick('calendar')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors flex-1 ${
            activePageView === 'calendar'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Kalender</span>
        </button>

        {/* Tab 4: Kalkulator Lot */}
        <button
          onClick={() => handleNavClick('lot-calc')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors flex-1 ${
            activePageView === 'lot-calc'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
          }`}
        >
          <Calculator className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Kalkulator</span>
        </button>

        {/* Tab 5: Menu / Tools Sheet */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors flex-1 ${
            isMenuOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
          }`}
        >
          <MenuIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Alat</span>
        </button>
      </nav>

      {/* SLIDE-UP MOBILE TOOLS DRAWER (ALA MYFXBOOK MORE MENU) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div 
            className="bg-white dark:bg-[#111827] rounded-t-2xl max-h-[85vh] overflow-y-auto border-t border-gray-200 dark:border-slate-800 p-4 pb-20 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Alat & Pengaturan Jurnal</h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-800 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onManualSave();
                  setIsMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  hasUnsavedChanges
                    ? 'bg-amber-400 text-gray-900 border-amber-500 shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 border-gray-200 dark:border-slate-700'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? 'Simpan Data (Ada Revisi)' : 'Tersimpan Aman'}</span>
              </button>

              <button
                onClick={onToggleDarkMode}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 text-xs font-semibold"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>{isDarkMode ? 'Tema Terang' : 'Tema Gelap'}</span>
              </button>
            </div>

            {/* Switch Mode: Kartu HP vs Sheet Excel */}
            <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
                Mode Tampilan Data
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveView('cards');
                    setActivePageView('sheet');
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    activeView === 'cards'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Mode Kartu HP (Myfxbook)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('table');
                    setActivePageView('sheet');
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    activeView === 'table'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Mode Spreadsheet Excel</span>
                </button>
              </div>
            </div>

            {/* Fitur Analisa Tambahan */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Fitur Analisis & Chart
              </span>

              <button
                onClick={() => handleNavClick('heatmap')}
                className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900 dark:text-white">Heatmap Hari & Jam Trading</strong>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">Analisis win rate Senin–Jumat & sesi forex</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('compounding')}
                className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900 dark:text-white">Target Modal Compounding</strong>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">Simulasi bunga berbunga profit konsisten</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('chart')}
                className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400">
                  <CandlestickChart className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900 dark:text-white">Live Chart Candlestick TradingView</strong>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">Chart multi-timeframe & login akun pribadi</span>
                </div>
              </button>

              <button
                onClick={() => {
                  handleNavClick('statement');
                }}
                className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900 dark:text-white">Statement Card Performa</strong>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">Rapor prestasi trading untuk dibagikan</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActivePageView('sheet');
                  setIsMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900 dark:text-white">History Bulanan ({totalArchivedMonths})</strong>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">Arsip otomatis rekap bulanan</span>
                </div>
              </button>
            </div>

            {/* Ekspor & Impor */}
            <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Ekspor & Backup
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    onExportExcel();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => {
                    onExportPdf();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    onExportCsv();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => {
                    onExportBackupJson();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Kosongkan Sheet */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onClearAll();
                  setIsMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Kosongkan Seluruh Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
