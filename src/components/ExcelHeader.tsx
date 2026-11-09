import React, { useState, useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  BarChart3, 
  LayoutGrid, 
  Table as TableIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit2,
  Check,
  X,
  Globe2,
  Calculator,
  Calendar,
  Radio,
  CandlestickChart
} from 'lucide-react';

interface ExcelHeaderProps {
  documentTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  onOpenNewModal: () => void;
  onOpenLiveChart: () => void;
  onOpenAnalytics: () => void;
  onOpenLotCalc: () => void;
  onOpenEcoCalendar: () => void;
  showMarketSessions: boolean;
  onToggleMarketSessions: () => void;
  showLiveTicker: boolean;
  onToggleLiveTicker: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onImportClick: () => void;
  onClearAll: () => void;
  onManualSave: () => void;
  hasUnsavedChanges: boolean;
  isSaveSuccess: boolean;
  activeView: 'table' | 'cards';
  setActiveView: (view: 'table' | 'cards') => void;
  totalTrades: number;
}

export const ExcelHeader: React.FC<ExcelHeaderProps> = ({
  documentTitle,
  onUpdateTitle,
  onOpenNewModal,
  onOpenLiveChart,
  onOpenAnalytics,
  onOpenLotCalc,
  onOpenEcoCalendar,
  showMarketSessions,
  onToggleMarketSessions,
  showLiveTicker,
  onToggleLiveTicker,
  onExportExcel,
  onExportCsv,
  onExportPdf,
  onImportClick,
  onClearAll,
  onManualSave,
  hasUnsavedChanges,
  isSaveSuccess,
  activeView,
  setActiveView,
  totalTrades
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleInput(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed) {
      onUpdateTitle(trimmed);
    } else {
      setTitleInput(documentTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTitleInput(documentTitle);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelTitle();
    }
  };

  return (
    <header className="bg-excel-green text-white shadow-md select-none sticky top-0 z-30">
      {/* Top Title Bar ala Excel */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-emerald-800 text-xs sm:text-sm">
        {/* Document Title Area (CRUD Judul) */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[65%] sm:max-w-md">
          <div className="bg-white/20 p-1 rounded flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>

          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                ref={titleInputRef}
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white text-gray-900 font-semibold px-2 py-0.5 rounded text-xs focus:outline-none ring-2 ring-yellow-400"
                placeholder="Nama dokumen..."
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 hover:bg-white/20 rounded text-emerald-200 hover:text-white"
                title="Simpan nama"
              >
                <Check className="w-3.5 h-3.5 text-yellow-300" />
              </button>
              <button
                onClick={handleCancelTitle}
                className="p-1 hover:bg-white/20 rounded text-rose-200 hover:text-white"
                title="Batal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 cursor-pointer py-0.5 px-1.5 rounded hover:bg-white/10 transition-colors truncate"
              title="Klik untuk mengubah nama lembar kerja (CRUD Judul)"
            >
              <span className="font-semibold tracking-wide truncate">
                {documentTitle}
              </span>
              <Edit2 className="w-3 h-3 text-emerald-200 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          )}

          {/* Indikator Status Save */}
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-400 text-gray-900 font-bold px-2 py-0.5 rounded shadow-xs shrink-0 animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-900" /> Belum Disimpan
            </span>
          )}
          {isSaveSuccess && !hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-medium shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Tersimpan
            </span>
          )}
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2">
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

          {/* Tombol Tambah Entry Baru */}
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-3 py-1.5 rounded text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Entry Baru</span>
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

          <button
            onClick={onManualSave}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-white transition-all font-semibold ${
              hasUnsavedChanges 
                ? 'bg-amber-400 hover:bg-amber-300 text-gray-900 shadow-xs ring-1 ring-white'
                : 'hover:bg-white/15'
            }`}
            title="Simpan data ke perangkat (Ctrl+S)"
          >
            <Save className={`w-3.5 h-3.5 ${hasUnsavedChanges ? 'text-gray-900' : 'text-amber-300'}`} />
            <span>Simpan (Ctrl+S)</span>
          </button>

          <div className="w-[1px] h-4 bg-emerald-700 mx-1" />

          {/* REALTIME FEATURES: Chart, Ticker, Market Sessions, Lot Calculator, Economic News */}
          <button
            onClick={onOpenLiveChart}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-white font-bold transition-all shadow-xs ring-1 ring-white/30 active:scale-95"
            title="Buka Chart Candlestick TradingView Real-Time Langsung di Sini"
          >
            <CandlestickChart className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-yellow-200">Live Chart</span>
          </button>

          <button
            onClick={onToggleLiveTicker}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              showLiveTicker ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-emerald-100'
            }`}
            title="Tampilkan / Sembunyikan Running Price Ticker Real-Time"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Live Price</span>
          </button>

          <button
            onClick={onToggleMarketSessions}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              showMarketSessions ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-emerald-100'
            }`}
            title="Tampilkan Jam Pasar Forex (London, NY, Tokyo, Sydney)"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Sesi Pasar</span>
          </button>

          <button
            onClick={onOpenLotCalc}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-emerald-100 hover:text-white transition-colors"
            title="Kalkulator Ukuran Lot & Manajemen Risiko Akun"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Hitung Lot</span>
          </button>

          <button
            onClick={onOpenEcoCalendar}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-emerald-100 hover:text-white transition-colors"
            title="Kalender Berita Ekonomi Forex (CPI, NFP, FOMC)"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Kalender News</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Statistik</span>
          </button>

          <div className="w-[1px] h-4 bg-emerald-700 mx-1" />

          {/* Export Buttons: XLSX, PDF, CSV */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Download file Excel .xlsx"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>Export .XLSX</span>
          </button>

          <button
            onClick={onExportPdf}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Download Laporan PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-300" />
            <span className="font-bold text-rose-100">Export .PDF</span>
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
            onClick={onClearAll}
            className="flex items-center gap-1 px-2 py-1 hover:bg-rose-900/60 rounded text-rose-200 hover:text-white transition-colors"
            title="Kosongkan semua data dalam sheet"
          >
            <Trash2 className="w-3 h-3 text-rose-300" />
            <span>Kosongkan Sheet</span>
          </button>
        </div>

        <div className="text-[11px] text-emerald-200 shrink-0 font-mono">
          Total Baris: <strong className="text-white">{totalTrades}</strong>
        </div>
      </div>
    </header>
  );
};
