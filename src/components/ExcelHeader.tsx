import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  onOpenNews?: () => void;
  onOpenHome?: () => void;
  onOpenProfile?: () => void;
  currentUsername?: string;
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
  activePageView?: string;
  onSwitchToSheet?: () => void;
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
  totalTrades,
  activePageView = 'sheet',
  onSwitchToSheet,
  onOpenNews,
  onOpenHome,
  onOpenProfile,
  currentUsername,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileButtonRef = useRef<HTMLButtonElement>(null);
  const fileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  // Posisi menu dropdown dihitung akurat dari tombol
  const handleToggleFileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileButtonRef.current) {
      const rect = fileButtonRef.current.getBoundingClientRect();
      const idealLeft = rect.left;
      const maxLeft = Math.max(10, window.innerWidth - 275);
      setMenuPos({
        top: rect.bottom + 4,
        left: Math.min(idealLeft, maxLeft),
      });
    }
    setIsFileMenuOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!isFileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        fileButtonRef.current?.contains(target) ||
        fileDropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsFileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFileMenuOpen]);

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
        {/* Logo Area (FX Logo ala Myfxbook) */}
        <div className="flex items-center gap-2.5">
          <img
            src="/fx-logo.png"
            alt="Fx"
            className="h-8 w-auto object-contain cursor-pointer transition-transform active:scale-95"
            onClick={onSwitchToSheet}
            title="MyFX Journal"
          />

          {/* Indikator Status Save */}
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-gray-900 font-bold px-2 py-0.5 rounded shadow-xs shrink-0 animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-900" />
              <span className="hidden sm:inline">Belum Disimpan</span>
            </span>
          )}
          {isSaveSuccess && !hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-medium shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span className="hidden sm:inline">Tersimpan</span>
            </span>
          )}
        </div>

        {/* Action Buttons Top Right: Home, Profile, & Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          {onOpenHome && (
            <button
              onClick={onOpenHome}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activePageView === 'home'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>Beranda</span>
            </button>
          )}

          {onOpenNews && (
            <button
              onClick={onOpenNews}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activePageView === 'news'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>Berita Real-Time</span>
            </button>
          )}

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title="Profil Pengguna & Akun Myfxbook"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUsername ? currentUsername.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline">{currentUsername || 'Profil'}</span>
            </button>
          )}

          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors text-xs font-semibold"
            title={isDarkMode ? 'Beralih ke Tema Excel Terang' : 'Beralih ke Tema TradingView Dark'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-200" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Excel Ribbon Quick Action Bar (Hanya tampil saat membuka sheet Jurnal / Alat Analisa) */}
      {activePageView !== 'home' && activePageView !== 'profile' && activePageView !== 'news' && (
      <div className={`hidden md:flex px-3 py-1.5 items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#0e6b37]'}`}>
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition-all shadow-xs active:scale-95 ${
              activePageView === 'chart'
                ? 'bg-white text-emerald-900 shadow-md ring-2 ring-yellow-400'
                : 'bg-white/20 hover:bg-white/30 text-white ring-1 ring-white/30'
            }`}
            title="Buka Chart Candlestick TradingView Real-Time"
          >
            <CandlestickChart className={`w-3.5 h-3.5 ${activePageView === 'chart' ? 'text-emerald-700' : 'text-yellow-300'}`} />
            <span className={activePageView === 'chart' ? 'text-emerald-950' : 'text-yellow-200'}>Live Chart</span>
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
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePageView === 'lot-calc'
                ? 'bg-white/30 text-white font-bold ring-1 ring-white/50 shadow-xs'
                : 'hover:bg-white/15 text-emerald-100 hover:text-white'
            }`}
            title="Kalkulator Ukuran Lot & Manajemen Risiko Akun (Support $10 hingga $100k)"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Hitung Lot</span>
          </button>

          <button
            onClick={onOpenEcoCalendar}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePageView === 'calendar'
                ? 'bg-white/30 text-white font-bold ring-1 ring-white/50 shadow-xs'
                : 'hover:bg-white/15 text-emerald-100 hover:text-white'
            }`}
            title="Kalender Berita Ekonomi Forex (CPI, NFP, FOMC)"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Kalender News</span>
          </button>

          <button
            onClick={onOpenHeatmap}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePageView === 'heatmap'
                ? 'bg-white/30 text-white font-bold ring-1 ring-white/50 shadow-xs'
                : 'hover:bg-white/15 text-emerald-100 hover:text-white'
            }`}
            title="Fitur #4: Heatmap Hari & Jam Trading Terbaik"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-orange-300" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={onOpenCompounding}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePageView === 'compounding'
                ? 'bg-white/30 text-white font-bold ring-1 ring-white/50 shadow-xs'
                : 'hover:bg-white/15 text-emerald-100 hover:text-white'
            }`}
            title="Fitur #5: Simulator Pertumbuhan Modal (Compounding)"
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
            <span>Target Modal</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              activePageView === 'analytics'
                ? 'bg-white/30 text-white font-bold ring-1 ring-white/50 shadow-xs'
                : 'hover:bg-white/15 text-white'
            }`}
            title="Fitur #8: Statistik, Analisis Strategi & Equity Curve"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Statistik</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          {/* SECTION 3: DROPDOWN FILE & EKSPOR/IMPOR */}
          <div className="relative">
            <button
              ref={fileButtonRef}
              type="button"
              onClick={handleToggleFileMenu}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-white font-bold transition-all shadow-xs cursor-pointer ${
                isFileMenuOpen 
                  ? 'bg-emerald-800 text-yellow-300 ring-2 ring-yellow-400' 
                  : 'bg-white/15 hover:bg-white/25 active:scale-95'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>File & Ekspor</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="text-[11px] text-emerald-200 shrink-0 font-mono">
          Total Baris: <strong className="text-white">{totalTrades}</strong>
        </div>
      </div>
      )}

      {/* REACT PORTAL DROPDOWN MENU — MENEMPEL LANGSUNG KE BODY SEHINGGA TIDAK BISA TERPOTONG */}
      {isFileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={fileDropdownRef}
          style={{
            position: 'fixed',
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            zIndex: 99999,
          }}
          className={`w-64 rounded-xl shadow-2xl border py-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans select-none ${
            isDarkMode
              ? 'bg-[#1e293b] text-slate-100 border-slate-700 shadow-black/90'
              : 'bg-white text-gray-800 border-gray-200 shadow-2xl'
          }`}
        >
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Ekspor Laporan
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportExcel();
            }}
            className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-excel-green dark:text-emerald-400 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-gray-800 dark:text-slate-100">Export Microsoft Excel (.xlsx)</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Format spreadsheet resmi</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportPdf();
            }}
            className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-gray-800 dark:text-slate-100">Export Dokumen PDF (.pdf)</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Laporan cetak Landscape A4</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportCsv();
            }}
            className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-gray-800 dark:text-slate-100">Export Data Mentah (.csv)</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Kompatibel semua software</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onOpenStatementCard();
            }}
            className="w-full px-3 py-2 text-left hover:bg-amber-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors border-t border-gray-100 dark:border-slate-700 cursor-pointer"
          >
            <div className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-amber-700 dark:text-amber-300">Cetak Statement Card Rapor</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Kartu performa untuk dibagikan</span>
            </div>
          </button>

          <div className="border-t border-gray-200 dark:border-slate-700 my-1" />

          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Impor & Backup (Fitur #10)
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onImportClick();
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-gray-800 dark:text-slate-100">Import Excel / CSV</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Masukkan catatan dari file luar</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportBackupJson();
            }}
            className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-purple-700 dark:text-purple-300">Backup Database (.json)</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Simpan backup cadangan aman</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onImportJsonClick();
            }}
            className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs text-purple-700 dark:text-purple-300">Restore Database (.json)</strong>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">Pulihkan data dari file backup</span>
            </div>
          </button>

          <div className="border-t border-gray-200 dark:border-slate-700 my-1" />

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onClearAll();
            }}
            className="w-full px-3 py-2 text-left hover:bg-rose-100 dark:hover:bg-rose-950/50 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 transition-colors cursor-pointer"
          >
            <div className="p-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs">Kosongkan Seluruh Sheet</strong>
              <span className="text-[10px] text-rose-500 dark:text-rose-400">Hapus semua data trade saat ini</span>
            </div>
          </button>
        </div>,
        document.body
      )}
    </header>
  );
};
