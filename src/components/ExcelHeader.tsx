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
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Edit2, 
  Check, 
  X, 
  Globe2, 
  Calculator, 
  Calendar, 
  CandlestickChart, 
  TrendingUp, 
  Award, 
  ChevronDown, 
  Database, 
  Moon, 
  Sun,
  User,
  LogOut
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
  onOpenSheet?: () => void;
  onLogout?: () => void;
  currentUsername?: string;
  userAvatar?: string;
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
  isDarkMode,
  onToggleDarkMode,
  totalTrades,
  activePageView = 'home',
  onSwitchToSheet,
  onOpenSheet,
  onOpenNews,
  onOpenHome,
  onOpenProfile,
  onLogout,
  currentUsername,
  userAvatar,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileButtonRef = useRef<HTMLButtonElement>(null);
  const fileDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

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

  useEffect(() => {
    if (!isFileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (fileButtonRef.current?.contains(target) || fileDropdownRef.current?.contains(target)) {
        return;
      }
      setIsFileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFileMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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

  const usernameDisplay = currentUsername || 'Dimas Tri M';
  const handleGoToSheet = () => {
    if (onOpenSheet) onOpenSheet();
    else if (onSwitchToSheet) onSwitchToSheet();
  };

  return (
    <header className={`${isDarkMode ? 'bg-[#0f172a] border-b border-slate-700' : 'bg-[#107c41]'} text-white shadow-md select-none sticky top-0 z-30 transition-colors`}>
      {/* ============================================================ */}
      {/* 1. TOP BAR EXCEL (Centered container max-w-[1240px]) */}
      {/* ============================================================ */}
      <div className="border-b border-white/10">
        <div className="max-w-[1240px] w-full mx-auto px-4 py-2 flex items-center justify-between gap-4 text-xs sm:text-sm">
          
          {/* Sisi Kiri: FX Logo Bersih */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/fx-logo.png"
              alt="Fx"
              className="h-8 w-auto object-contain cursor-pointer transition-transform active:scale-95"
              onClick={onOpenHome}
              title="Beranda"
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

          {/* Sisi Tengah: Tab Navigasi Utama Terpusat */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
            {onOpenHome && (
              <button
                onClick={onOpenHome}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                  activePageView === 'home'
                    ? 'bg-white text-[#107c41] font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Beranda
              </button>
            )}

            <button
              onClick={handleGoToSheet}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                activePageView === 'sheet'
                  ? 'bg-white text-[#107c41] font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Jurnal Trading
            </button>

            {onOpenNews && (
              <button
                onClick={onOpenNews}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                  activePageView === 'news'
                    ? 'bg-white text-[#107c41] font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Berita Live
              </button>
            )}

            <button
              onClick={onOpenEcoCalendar}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                activePageView === 'calendar'
                  ? 'bg-white text-[#107c41] font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Kalender
            </button>

            <button
              onClick={onOpenLotCalc}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                activePageView === 'lot-calc'
                  ? 'bg-white text-[#107c41] font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Hitung Lot
            </button>

            <button
              onClick={onOpenLiveChart}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                activePageView === 'chart'
                  ? 'bg-white text-[#107c41] font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Live Chart
            </button>
          </div>

          {/* Sisi Kanan: Theme Toggle & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white transition-colors text-xs font-semibold"
              title={isDarkMode ? 'Beralih ke Tema Excel Hijau' : 'Beralih ke Tema Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="hidden sm:inline text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-200" />
                  <span className="hidden sm:inline text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-800 border border-white/30 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{usernameDisplay.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline">{usernameDisplay}</span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{usernameDisplay.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{usernameDisplay}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400">Akun Trading Aktif</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Profil Trader</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleGoToSheet();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jurnal Sheet Excel</span>
                  </button>

                  <div className="border-t border-gray-100 dark:border-slate-700 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PITA MENU EXCEL (Hanya Tampil Saat Membuka Sheet Jurnal) */}
      {/* ============================================================ */}
      {activePageView === 'sheet' && (
        <div className={`hidden md:flex border-b text-xs scrollbar-none transition-colors ${
          isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-[#0e6b37] border-emerald-800'
        }`}>
          <div className="max-w-[1240px] w-full mx-auto px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Tambah Baris */}
              <button
                onClick={onOpenNewModal}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-white font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-yellow-300" />
                <span>Tambah Baris</span>
              </button>

              {/* Simpan */}
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

              {/* Menu File Dropdown */}
              <button
                ref={fileButtonRef}
                onClick={handleToggleFileMenu}
                className="flex items-center gap-1 px-2.5 py-1 hover:bg-white/15 rounded text-white transition-colors font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>File (Ekspor/Impor)</span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              <div className="w-[1px] h-4 bg-white/20 mx-1" />

              {/* Tools Cepat */}
              <button
                onClick={onToggleMarketSessions}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                  showMarketSessions ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-emerald-100'
                }`}
                title="Jam Pasar Forex"
              >
                <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Sesi Pasar</span>
              </button>

              <button
                onClick={onOpenLotCalc}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
                title="Kalkulator Lot"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-300" />
                <span>Hitung Lot</span>
              </button>

              <button
                onClick={onOpenEcoCalendar}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
                title="Kalender Berita"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>Kalender</span>
              </button>

              <button
                onClick={onOpenHeatmap}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
                title="Heatmap Trading"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-orange-300" />
                <span>Heatmap</span>
              </button>

              <button
                onClick={onOpenCompounding}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
                title="Simulator Compounding"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
                <span>Target Modal</span>
              </button>

              <button
                onClick={onOpenStatementCard}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
                title="Statemen Trading"
              >
                <Award className="w-3.5 h-3.5 text-yellow-300" />
                <span>Statemen</span>
              </button>
            </div>

            <div className="text-[11px] text-emerald-200 shrink-0 font-mono">
              Total: <strong className="text-white">{totalTrades} Baris</strong>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL DROPDOWN MENU EKSPOR / IMPOR */}
      {isFileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={fileDropdownRef}
          style={{
            position: 'fixed',
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            zIndex: 99999,
          }}
          className={`w-64 rounded shadow-2xl border py-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs select-none ${
            isDarkMode ? 'bg-[#1e293b] text-slate-100 border-slate-700' : 'bg-white text-gray-800 border-gray-200'
          }`}
        >
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Ekspor Spreadsheet
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportExcel();
            }}
            className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors font-semibold text-emerald-700 dark:text-emerald-400"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Ekspor ke Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportCsv();
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Ekspor ke CSV (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportPdf();
            }}
            className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors text-rose-700 dark:text-rose-400 font-semibold"
          >
            <Download className="w-4 h-4 text-rose-600" />
            <span>Cetak Rekap PDF (.pdf)</span>
          </button>

          <div className="border-t border-gray-200 dark:border-slate-700 my-1" />

          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Impor Data
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onImportClick();
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Impor File (.xlsx, .csv)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onExportBackupJson();
            }}
            className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors text-purple-700 dark:text-purple-300"
          >
            <Database className="w-4 h-4 text-purple-600" />
            <span>Backup Data JSON (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onImportJsonClick();
            }}
            className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors text-purple-700 dark:text-purple-300"
          >
            <Upload className="w-4 h-4 text-purple-600" />
            <span>Pulihkan Data JSON (.json)</span>
          </button>

          <div className="border-t border-gray-200 dark:border-slate-700 my-1" />

          <button
            type="button"
            onClick={() => {
              setIsFileMenuOpen(false);
              onClearAll();
            }}
            className="w-full px-3 py-2 text-left hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 transition-colors font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Seluruh Sheet</span>
          </button>
        </div>,
        document.body
      )}
    </header>
  );
};
