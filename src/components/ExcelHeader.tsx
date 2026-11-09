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
  CandlestickChart,
  Flame,
  TrendingUp,
  Award,
  ChevronDown,
  Database,
  Moon,
  Sun
} from 'lucide-react';

interface ExcelHeaderProps {
  documentTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  onOpenNewModal: () => void;
  onOpenLiveChart: () => void;
  onOpenAnalytics: () => void;
  onOpenLotCalc: () => void;
  onOpenEcoCalendar: () => void;
  onOpenHeatmap: () => void;
  onOpenCompounding: () => void;
  onOpenStatementCard: () => void;
  showMarketSessions: boolean;
  onToggleMarketSessions: () => void;
  showLiveTicker: boolean;
  onToggleLiveTicker: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onExportBackupJson: () => void;
  onImportClick: () => void;
  onImportJsonClick: () => void;
  onClearAll: () => void;
  onManualSave: () => void;
  hasUnsavedChanges: boolean;
  isSaveSuccess: boolean;
  activeView: 'table' | 'cards';
  setActiveView: (view: 'table' | 'cards') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
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
  onOpenHeatmap,
  onOpenCompounding,
  onOpenStatementCard,
  showMarketSessions,
  onToggleMarketSessions,
  showLiveTicker,
  onToggleLiveTicker,
  onExportExcel,
  onExportCsv,
  onExportPdf,
  onExportBackupJson,
  onImportClick,
  onImportJsonClick,
  onClearAll,
  onManualSave,
  hasUnsavedChanges,
  isSaveSuccess,
  activeView,
  setActiveView,
  isDarkMode,
  onToggleDarkMode,
  totalTrades
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className={`${isDarkMode ? 'bg-[#0f172a] border-b border-slate-700' : 'bg-excel-green'} text-white shadow-md select-none sticky top-0 z-30 transition-colors`}>
      {/* Top Title Bar */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/10 text-xs sm:text-sm">
        {/* Document Title Area (CRUD Judul) */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[60%] sm:max-w-md">
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
          {/* Fitur #9: Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/15 hover:bg-white/25 text-white transition-colors text-xs font-semibold"
            title={isDarkMode ? 'Beralih ke Tema Excel Terang' : 'Beralih ke Tema TradingView Dark'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-200" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* View Toggle on Mobile */}
          <div className="flex bg-black/25 p-0.5 rounded text-xs">
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeView === 'table' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
              title="Tampilan Tabel Excel"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sheet Excel</span>
            </button>
            <button
              onClick={() => setActiveView('cards')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeView === 'cards' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-emerald-100 hover:text-white'
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

      {/* Excel Ribbon Quick Action Bar (RAPI DENGAN DROPDOWN EKSPOR/IMPORT) */}
      <div className={`px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#0e6b37]'}`}>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* SECTION 1: ENTRI & SIMPAN */}
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

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          {/* SECTION 2: FITUR REALTIME & ANALISA TRADING */}
          <button
            onClick={onOpenLiveChart}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-white font-bold transition-all shadow-xs ring-1 ring-white/30 active:scale-95"
            title="Buka Chart Candlestick TradingView Real-Time"
          >
            <CandlestickChart className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-yellow-200">Live Chart</span>
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
            title="Kalkulator Ukuran Lot & Manajemen Risiko Akun (Support $10 hingga $100k)"
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
            onClick={onOpenHeatmap}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-emerald-100 hover:text-white transition-colors"
            title="Fitur #4: Heatmap Hari & Jam Trading Terbaik"
          >
            <Flame className="w-3.5 h-3.5 text-orange-300" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={onOpenCompounding}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-emerald-100 hover:text-white transition-colors"
            title="Fitur #5: Simulator Pertumbuhan Modal (Compounding)"
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
            <span>Target Modal</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white transition-colors"
            title="Fitur #8: Statistik, Analisis Strategi & Equity Curve"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Statistik</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          {/* SECTION 3: DROPDOWN FILE & EKSPOR/IMPOR RAPI */}
          <div className="relative" ref={fileMenuRef}>
            <button
              onClick={() => setIsFileMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded text-white font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>File & Ekspor</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Popup */}
            {isFileMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 text-xs font-sans">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Ekspor Laporan
                </div>

                <button
                  onClick={() => {
                    onExportExcel();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 text-excel-green" />
                  <div>
                    <strong className="block text-xs">Export ke Microsoft Excel (.xlsx)</strong>
                    <span className="text-[10px] text-gray-500">Format spreadsheet resmi</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportPdf();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <div>
                    <strong className="block text-xs">Export Dokumen PDF (.pdf)</strong>
                    <span className="text-[10px] text-gray-500">Laporan cetak Landscape A4</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportCsv();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <div>
                    <strong className="block text-xs">Export Data Mentah (.csv)</strong>
                    <span className="text-[10px] text-gray-500">Kompatibel semua software</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenStatementCard();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-gray-800 font-medium border-t border-gray-100"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <strong className="block text-xs text-amber-900">Cetak Statement Card Rapor</strong>
                    <span className="text-[10px] text-gray-500">Kartu performa untuk dibagikan</span>
                  </div>
                </button>

                <div className="border-t border-gray-200 my-1.5" />

                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Impor & Backup (Fitur #10)
                </div>

                <button
                  onClick={() => {
                    onImportClick();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                  <div>
                    <strong className="block text-xs">Import Excel / CSV</strong>
                    <span className="text-[10px] text-gray-500">Masukkan catatan dari file luar</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportBackupJson();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <Database className="w-4 h-4 text-purple-600" />
                  <div>
                    <strong className="block text-xs">Backup Database (.json)</strong>
                    <span className="text-[10px] text-gray-500">Simpan backup cadangan aman</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onImportJsonClick();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center gap-2 text-gray-800 font-medium"
                >
                  <Upload className="w-4 h-4 text-purple-600" />
                  <div>
                    <strong className="block text-xs">Restore Database (.json)</strong>
                    <span className="text-[10px] text-gray-500">Pulihkan data dari file backup</span>
                  </div>
                </button>

                <div className="border-t border-gray-200 my-1.5" />

                <button
                  onClick={() => {
                    onClearAll();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-100 flex items-center gap-2 text-rose-700 font-medium"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <div>
                    <strong className="block text-xs">Kosongkan Seluruh Sheet</strong>
                    <span className="text-[10px] text-rose-500">Hapus semua data trade saat ini</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-emerald-200 shrink-0 font-mono">
          Total Baris: <strong className="text-white">{totalTrades}</strong>
        </div>
      </div>
    </header>
  );
};
