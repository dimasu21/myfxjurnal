import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trade, TradeFilter } from './types/trade';
import { UserAccount } from './types/user';
import { getCurrentSessionUser, saveTradesForCurrentUser, logoutUser } from './utils/authStorage';
import { getSavedTrades, saveTrades, clearSavedTrades } from './utils/storage';
import { exportToExcel, exportToCsv, exportToPdf, importFromSpreadsheet, exportToJson, importFromJson } from './utils/exportImport';
import { useForexTickers } from './utils/useForexTickers';
import { evaluateDiscipline } from './utils/disciplineGuard';
import { ExcelHeader } from './components/ExcelHeader';
import { LiveTicker } from './components/LiveTicker';
import { MarketSessions } from './components/MarketSessions';
import { FormulaBar } from './components/FormulaBar';
import { StatsBar } from './components/StatsBar';
import { TradeTable } from './components/TradeTable';
import { MobileCardView } from './components/MobileCardView';
import { TradeModal } from './components/TradeModal';
import { ExcelFooter } from './components/ExcelFooter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DisciplineAlertBanner } from './components/DisciplineAlertBanner';
import { MonthlyHistoryView } from './components/MonthlyHistoryView';
import { LotCalculatorView } from './components/LotCalculatorView';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { HeatmapView } from './components/HeatmapView';
import { CompoundingView } from './components/CompoundingView';
import { AnalyticsView } from './components/AnalyticsView';
import { LiveChartView } from './components/LiveChartView';
import { TraderStatementCardView } from './components/TraderStatementCardView';
import { HomeView } from './components/HomeView';
import { RealtimeNewsView } from './components/RealtimeNewsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { checkAndAutoArchiveMonth, getMonthlyArchives } from './utils/monthlyArchive';
import { Plus } from 'lucide-react';

export default function App() {
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSessionUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Document title dengan dukungan CRUD / rename
  const [documentTitle, setDocumentTitle] = useState<string>(() => {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('forex_journal_doc_title') || 'Jurnal_Trading_Forex.xlsx'
      : 'Jurnal_Trading_Forex.xlsx';
  });

  // Dark Mode Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forex_journal_dark_mode');
      if (saved !== null) return saved === 'true';
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('forex_journal_dark_mode', 'true');
      } catch (e) {
        console.error(e);
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('forex_journal_dark_mode', 'false');
      } catch (e) {
        console.error(e);
      }
    }
  }, [isDarkMode]);

  // Data trades: dimuat dari akun user jika login, atau dari storage lokal
  const [trades, setTrades] = useState<Trade[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // Real-time Forex Features State
  const { tickers, isLive } = useForexTickers();
  const [showLiveTicker, setShowLiveTicker] = useState(true);
  const [showMarketSessions, setShowMarketSessions] = useState(true);
  const [chartPair, setChartPair] = useState('EUR/USD');

  // Full-Page Views: Beranda default jika ada user, atau sheet jurnal
  type PageView = 'home' | 'sheet' | 'news' | 'profile' | 'lot-calc' | 'calendar' | 'heatmap' | 'compounding' | 'analytics' | 'chart' | 'statement';
  const [activePageView, setActivePageView] = useState<PageView>('home');

  // Active view: otomatis 'cards' di HP (< 768px), otomatis 'table' (sheet) di Desktop/Website (>= 768px)
  const [activeView, setActiveView] = useState<'table' | 'cards'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'cards' : 'table';
    }
    return 'table';
  });

  // Listener resize otomatis: HP otomatis kartu, desktop otomatis sheet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveView('cards');
      } else {
        setActiveView('table');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sheet Tabs: 'all' | 'win' | 'loss' | 'summary' | 'history'
  const [activeSheet, setActiveSheet] = useState<'all' | 'win' | 'loss' | 'summary' | 'history'>('all');
  const [archivedMonthsCount, setArchivedMonthsCount] = useState<number>(0);

  // Auto-Archive Detection & Count update
  useEffect(() => {
    setArchivedMonthsCount(getMonthlyArchives().length);
  }, [activeSheet]);

  useEffect(() => {
    if (trades.length > 0) {
      const res = checkAndAutoArchiveMonth(trades);
      if (res.archived) {
        setArchivedMonthsCount(getMonthlyArchives().length);
      }
    }
  }, [trades]);

  // Formula bar state
  const [selectedCell, setSelectedCell] = useState('A1');
  const [cellValue, setCellValue] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Search & Filter
  const [filter, setFilter] = useState<TradeFilter>({
    search: '',
    pair: '',
    status: '',
    emosi: '',
    strategi: '',
    sortBy: 'tanggal',
    sortOrder: 'desc',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Inisialisasi User & Trades saat aplikasi dibuka
  useEffect(() => {
    const sessionUser = getCurrentSessionUser();
    if (sessionUser) {
      setCurrentUser(sessionUser);
      setTrades(sessionUser.trades || []);
      setActivePageView('home'); // Masuk langsung ke beranda Myfxbook setelah login
    } else {
      // Jika belum ada user, buka AuthModal otomatis
      setIsAuthModalOpen(true);
      const fallbackTrades = getSavedTrades();
      setTrades(fallbackTrades);
    }
    setHasUnsavedChanges(false);
  }, []);

  // Evaluasi kedisiplinan trading
  const disciplineWarnings = useMemo(() => evaluateDiscipline(trades), [trades]);

  // Update Judul Dokumen (CRUD Judul)
  const handleUpdateTitle = (newTitle: string) => {
    setDocumentTitle(newTitle);
    try {
      localStorage.setItem('forex_journal_doc_title', newTitle);
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard shortcut: Ctrl + S / Cmd + S untuk Simpan Manual
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trades, currentUser]);

  // Peringatan saat menutup tab jika ada data belum disimpan
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // When sheet changes to summary, switch to analytics full-page view
  useEffect(() => {
    if (activeSheet === 'summary') {
      setActivePageView('analytics');
    }
  }, [activeSheet]);

  // Filtered trades based on filters and sheet tab
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      // Sheet tab filter
      if (activeSheet === 'win' && trade.pips <= 0) return false;
      if (activeSheet === 'loss' && trade.pips >= 0) return false;

      // Status dropdown filter
      if (filter.status && trade.status !== filter.status) return false;

      // Pair filter
      if (filter.pair && trade.pair !== filter.pair) return false;

      // Strategi filter
      if (filter.strategi && trade.strategi !== filter.strategi) return false;

      // Search query (matches pair, alasan, evaluasi, emosi, strategi)
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matchPair = trade.pair.toLowerCase().includes(q);
        const matchAlasan = trade.alasan.toLowerCase().includes(q);
        const matchEvaluasi = trade.evaluasi?.toLowerCase().includes(q);
        const matchEmosi = trade.emosi?.toLowerCase().includes(q);
        const matchStrategi = trade.strategi?.toLowerCase().includes(q);
        if (!matchPair && !matchAlasan && !matchEvaluasi && !matchEmosi && !matchStrategi) {
          return false;
        }
      }

      return true;
    });
  }, [trades, activeSheet, filter]);

  // Selected trade object
  const selectedTrade = useMemo(() => {
    return trades.find((t) => t.id === selectedTradeId) || null;
  }, [trades, selectedTradeId]);

  // Available unique pairs for filter dropdown
  const availablePairs = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => set.add(t.pair));
    return Array.from(set).sort();
  }, [trades]);

  // Handlers
  const handleSelectTrade = (trade: Trade, cellRef: string, value: string) => {
    setSelectedTradeId(trade.id);
    setSelectedCell(cellRef);
    setCellValue(value);
  };

  const handleAddNew = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    setTrades(updated);
    
    // Simpan otomatis ke akun user aktif
    if (currentUser) {
      saveTradesForCurrentUser(currentUser.id, updated);
      setCurrentUser((prev) => prev ? { ...prev, trades: updated } : null);
    } else {
      saveTrades(updated);
    }

    setHasUnsavedChanges(true);
    if (selectedTradeId === id) {
      setSelectedTradeId(null);
      setCellValue('');
    }
  };

  // Simpan Trade Baru / Revisi (OTOMATIS TERSIMPAN DI AKUN USER)
  const handleSaveTrade = (savedTrade: Trade) => {
    let updated: Trade[];
    const exists = trades.some((t) => t.id === savedTrade.id);
    if (exists) {
      updated = trades.map((t) => (t.id === savedTrade.id ? savedTrade : t));
    } else {
      updated = [savedTrade, ...trades];
    }

    setTrades(updated);
    
    // Jaminan tersimpan permanen di akun user (Tidak hilang saat refresh)
    if (currentUser) {
      saveTradesForCurrentUser(currentUser.id, updated);
      setCurrentUser((prev) => prev ? { ...prev, trades: updated } : null);
    } else {
      saveTrades(updated);
    }

    setHasUnsavedChanges(false);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 2000);
  };

  // Simpan Manual Tambahan (Ctrl+S / Klik Tombol)
  const handleManualSave = () => {
    if (currentUser) {
      saveTradesForCurrentUser(currentUser.id, trades);
    } else {
      saveTrades(trades);
    }
    setHasUnsavedChanges(false);
    setIsSaveSuccess(true);
    setTimeout(() => {
      setIsSaveSuccess(false);
    }, 2500);
  };

  // Kosongkan Semua Data Sheet
  const handleClearAll = () => {
    if (trades.length === 0) {
      alert('Sheet sudah dalam keadaan kosong.');
      return;
    }

    if (confirm('Yakin ingin mengosongkan seluruh catatan trade di sheet ini?')) {
      setTrades([]);
      if (currentUser) {
        saveTradesForCurrentUser(currentUser.id, []);
        setCurrentUser((prev) => prev ? { ...prev, trades: [] } : null);
      } else {
        clearSavedTrades();
      }
      setHasUnsavedChanges(false);
      setSelectedTradeId(null);
      setCellValue('');
    }
  };

  const cleanBaseName = documentTitle.replace(/\.[^/.]+$/, '');

  const handleExportExcel = () => {
    const filename = documentTitle.endsWith('.xlsx') ? documentTitle : `${documentTitle}.xlsx`;
    exportToExcel(trades, filename);
  };

  const handleExportCsv = () => {
    exportToCsv(trades, `${cleanBaseName}.csv`);
  };

  const handleExportPdf = () => {
    exportToPdf(trades, `${cleanBaseName}.pdf`);
  };

  const handleExportBackupJson = () => {
    exportToJson(trades, `${cleanBaseName}_backup.json`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportJsonClick = () => {
    jsonFileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromSpreadsheet(file);
      if (imported.length > 0) {
        const merged = [...imported, ...trades];
        setTrades(merged);
        if (currentUser) {
          saveTradesForCurrentUser(currentUser.id, merged);
          setCurrentUser((prev) => prev ? { ...prev, trades: merged } : null);
        } else {
          saveTrades(merged);
        }
        setHasUnsavedChanges(false);
        alert(`Berhasil mengimpor ${imported.length} baris trade dan langsung tersimpan di akun Anda!`);
      } else {
        alert('Tidak ada baris data valid dalam file tersebut.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal membaca file. Pastikan format Excel (.xlsx) atau CSV sesuai.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleJsonFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJson(file);
      if (imported.length > 0) {
        const merged = [...imported, ...trades];
        setTrades(merged);
        if (currentUser) {
          saveTradesForCurrentUser(currentUser.id, merged);
          setCurrentUser((prev) => prev ? { ...prev, trades: merged } : null);
        } else {
          saveTrades(merged);
        }
        setHasUnsavedChanges(false);
        alert(`Berhasil me-restore ${imported.length} baris data trade dari file backup JSON ke akun Anda!`);
      } else {
        alert('Tidak ada baris data trade valid dalam file JSON tersebut.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal me-restore file JSON. Pastikan file valid.');
    } finally {
      if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
    }
  };

  const handleOpenLiveChart = (pair: string = 'EUR/USD') => {
    setChartPair(pair);
    setActivePageView('chart');
  };

  const handleSelectTickerPair = (pair: string) => {
    handleOpenLiveChart(pair);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setTrades(user.trades || []);
    setIsAuthModalOpen(false);
    setActivePageView('home'); // Masuk langsung ke beranda
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setTrades([]);
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`flex flex-col h-[100dvh] w-full max-w-full overflow-x-hidden ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-gray-800'} font-sans`}>
      {/* Hidden File Input for Excel/CSV Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hidden File Input for JSON Backup Restore */}
      <input
        ref={jsonFileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleJsonFileChange}
      />

      {/* Excel Ribbon Top Header with FX Logo, Home, Profile, & Theme Toggle */}
      <ExcelHeader
        documentTitle={documentTitle}
        onUpdateTitle={handleUpdateTitle}
        onOpenNewModal={handleAddNew}
        onOpenLiveChart={() => setActivePageView((prev) => (prev === 'chart' ? 'sheet' : 'chart'))}
        onOpenAnalytics={() => setActivePageView((prev) => (prev === 'analytics' ? 'sheet' : 'analytics'))}
        onOpenLotCalc={() => setActivePageView((prev) => (prev === 'lot-calc' ? 'sheet' : 'lot-calc'))}
        onOpenEcoCalendar={() => setActivePageView((prev) => (prev === 'calendar' ? 'sheet' : 'calendar'))}
        onOpenHeatmap={() => setActivePageView((prev) => (prev === 'heatmap' ? 'sheet' : 'heatmap'))}
        onOpenCompounding={() => setActivePageView((prev) => (prev === 'compounding' ? 'sheet' : 'compounding'))}
        onOpenStatementCard={() => setActivePageView((prev) => (prev === 'statement' ? 'sheet' : 'statement'))}
        onOpenNews={() => setActivePageView('news')}
        onOpenHome={() => setActivePageView('home')}
        onOpenProfile={() => setActivePageView('profile')}
        currentUsername={currentUser?.username}
        userAvatar={currentUser?.avatarUrl}
        activePageView={activePageView}
        onSwitchToSheet={() => setActivePageView('sheet')}
        onOpenSheet={() => setActivePageView('sheet')}
        onLogout={handleLogout}
        showMarketSessions={showMarketSessions}
        onToggleMarketSessions={() => setShowMarketSessions((prev) => !prev)}
        showLiveTicker={showLiveTicker}
        onToggleLiveTicker={() => setShowLiveTicker((prev) => !prev)}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        onExportBackupJson={handleExportBackupJson}
        onImportClick={handleImportClick}
        onImportJsonClick={handleImportJsonClick}
        onClearAll={handleClearAll}
        onManualSave={handleManualSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaveSuccess={isSaveSuccess}
        activeView={activeView}
        setActiveView={setActiveView}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        totalTrades={trades.length}
      />

      {/* Discipline Alert Banner: Hanya di Sheet */}
      {activePageView === 'sheet' && <DisciplineAlertBanner warnings={disciplineWarnings} />}

      {/* Running Forex & Gold Price Ticker: Muncul di Semua Halaman */}
      {showLiveTicker && (
        <LiveTicker
          tickers={tickers}
          isLive={isLive}
          onSelectPair={handleSelectTickerPair}
        />
      )}

      {/* Market Sessions Clock (Desktop): Hanya di Sheet */}
      {showMarketSessions && activePageView === 'sheet' && (
        <div className="hidden md:block">
          <MarketSessions />
        </div>
      )}

      {/* Formula Bar & Stats Bar: Hanya muncul saat di Desktop & di Sheet Excel */}
      {activePageView === 'sheet' && (
        <div className="hidden md:block">
          <FormulaBar
            selectedCell={selectedCell}
            cellValue={cellValue}
            selectedTrade={selectedTrade}
            onEditSelectedTrade={() => selectedTrade && handleEdit(selectedTrade)}
            onDeleteSelectedTrade={() => {
              if (
                selectedTrade &&
                confirm(`Hapus baris trade ${selectedTrade.pair} (${selectedTrade.tanggal})?`)
              ) {
                handleDelete(selectedTrade.id);
              }
            }}
            filter={filter}
            setFilter={setFilter}
            availablePairs={availablePairs}
          />
          <StatsBar trades={trades} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activePageView === 'home' ? (
          <HomeView
            user={currentUser || {
              id: 'guest',
              username: 'Trader',
              email: '',
              createdAt: new Date().toISOString(),
              trades: trades,
            }}
            trades={trades}
            onNavigate={(view) => setActivePageView(view)}
            onOpenNewTrade={handleAddNew}
          />
        ) : activePageView === 'news' ? (
          <RealtimeNewsView
            onBack={() => setActivePageView('home')}
          />
        ) : activePageView === 'profile' ? (
          <ProfileView
            user={currentUser || {
              id: 'guest',
              username: 'Trader',
              email: '',
              createdAt: new Date().toISOString(),
              trades: trades,
            }}
            trades={trades}
            onBack={() => setActivePageView('home')}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
            onLogout={handleLogout}
          />
        ) : activePageView === 'lot-calc' ? (
          <LotCalculatorView
            onBack={() => setActivePageView('sheet')}
            trades={trades}
            tickers={tickers}
            user={currentUser}
            onApplyToTrade={(prefill) => {
              setEditingTrade({
                id: '',
                tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                pair: prefill.pair,
                posisi: prefill.posisi,
                entry: prefill.entry,
                sl: prefill.sl,
                tp: prefill.tp,
                lot: prefill.lot,
                pips: 0,
                status: 'OPEN',
                alasan: 'Manajemen risiko lot terukur',
                emosi: 'Disiplin',
                evaluasi: '',
                riskReward: prefill.riskReward || '1:2',
              } as Trade);
              setIsModalOpen(true);
              setActivePageView('sheet');
            }}
          />
        ) : activePageView === 'calendar' ? (
          <EconomicCalendarView
            onBack={() => setActivePageView('sheet')}
          />
        ) : activePageView === 'heatmap' ? (
          <HeatmapView
            trades={trades}
            onBack={() => setActivePageView('sheet')}
          />
        ) : activePageView === 'compounding' ? (
          <CompoundingView
            onBack={() => setActivePageView('sheet')}
          />
        ) : activePageView === 'analytics' ? (
          <AnalyticsView
            trades={trades}
            onBack={() => setActivePageView('sheet')}
          />
        ) : activePageView === 'chart' ? (
          <LiveChartView
            initialPair={chartPair}
            onBack={() => setActivePageView('sheet')}
          />
        ) : activePageView === 'statement' ? (
          <TraderStatementCardView
            trades={trades}
            documentTitle={documentTitle}
            onBack={() => setActivePageView('sheet')}
          />
        ) : activeSheet === 'history' ? (
          <MonthlyHistoryView
            currentTrades={trades}
            onLoadTradesToSheet={(loadedTrades) => {
              setTrades(loadedTrades);
              if (currentUser) {
                saveTradesForCurrentUser(currentUser.id, loadedTrades);
              }
              setHasUnsavedChanges(false);
            }}
            onBackToMainSheet={() => setActiveSheet('all')}
          />
        ) : activeView === 'table' ? (
          <TradeTable
            trades={filteredTrades}
            selectedTradeId={selectedTradeId}
            onSelectTrade={handleSelectTrade}
            onEditTrade={handleEdit}
            onDeleteTrade={handleDelete}
            onAddNew={handleAddNew}
          />
        ) : (
          <MobileCardView
            trades={filteredTrades}
            onEditTrade={handleEdit}
            onDeleteTrade={handleDelete}
            onSelectTrade={handleSelectTrade}
            onAddNew={handleAddNew}
          />
        )}

        {/* Floating Action Button (FAB) for Quick Add */}
        {activePageView === 'sheet' && activeSheet !== 'history' && (
          <button
            onClick={handleAddNew}
            aria-label="Tambah Trade Baru"
            title="Tambah Trade Baru"
            className="fixed bottom-16 md:bottom-12 right-4 md:right-6 z-30 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 md:p-4 rounded-full shadow-xl flex items-center justify-center active:scale-90 hover:scale-105 transition-all group"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
      </main>

      {/* Excel Sheet Tabs & Status Bar (Khusus di Halaman Sheet di Desktop) */}
      {activePageView === 'sheet' && (
        <ExcelFooter
          activeSheet={activeSheet}
          setActiveSheet={(sheet) => {
            if (sheet === 'summary') {
              setActivePageView('analytics');
            } else {
              setActivePageView('sheet');
              setActiveSheet(sheet);
            }
          }}
          filteredTrades={filteredTrades}
          totalArchivedMonths={archivedMonthsCount}
        />
      )}

      {/* Persistent Bottom Navigation Bar Ala Myfxbook Mobile */}
      <MobileBottomNav
        activePageView={activePageView}
        setActivePageView={setActivePageView}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
        }}
        onOpenNewModal={handleAddNew}
        onManualSave={handleManualSave}
        hasUnsavedChanges={hasUnsavedChanges}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onExportCsv={handleExportCsv}
        onExportBackupJson={handleExportBackupJson}
        onImportClick={handleImportClick}
        onImportJsonClick={handleImportJsonClick}
        onClearAll={handleClearAll}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        totalArchivedMonths={archivedMonthsCount}
      />

      {/* Add / Edit Trade Modal Form */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        editingTrade={editingTrade}
      />

      {/* Auth / Register / Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onSuccess={handleAuthSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
