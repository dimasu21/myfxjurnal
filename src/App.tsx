import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trade, TradeFilter } from './types/trade';
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
import { AnalyticsModal } from './components/AnalyticsModal';
import { LotCalculatorModal } from './components/LotCalculatorModal';
import { EconomicCalendarModal } from './components/EconomicCalendarModal';
import { LiveChartModal } from './components/LiveChartModal';
import { DisciplineAlertBanner } from './components/DisciplineAlertBanner';
import { HeatmapModal } from './components/HeatmapModal';
import { CompoundingModal } from './components/CompoundingModal';
import { TraderStatementCardModal } from './components/TraderStatementCardModal';
import { Plus } from 'lucide-react';

export default function App() {
  // Document title dengan dukungan CRUD / rename
  const [documentTitle, setDocumentTitle] = useState<string>(() => {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('forex_journal_doc_title') || 'Jurnal_Trading_Forex.xlsx'
      : 'Jurnal_Trading_Forex.xlsx';
  });

  // Dark Mode Theme (Bloomberg / TradingView Dark)
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

  // Data trades default kosong (tanpa dummy data awal)
  const [trades, setTrades] = useState<Trade[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // Real-time Forex Features State
  const { tickers, isLive } = useForexTickers();
  const [showLiveTicker, setShowLiveTicker] = useState(true);
  const [showMarketSessions, setShowMarketSessions] = useState(true);
  const [isLotCalcOpen, setIsLotCalcOpen] = useState(false);
  const [isEcoCalendarOpen, setIsEcoCalendarOpen] = useState(false);
  const [isLiveChartOpen, setIsLiveChartOpen] = useState(false);
  const [chartPair, setChartPair] = useState('EUR/USD');

  // Modals for Features 4, 5, 7, 8
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isCompoundingOpen, setIsCompoundingOpen] = useState(false);
  const [isStatementCardOpen, setIsStatementCardOpen] = useState(false);

  // Active view: 'table' (Excel spreadsheet) or 'cards' (Touch-friendly card list)
  const [activeView, setActiveView] = useState<'table' | 'cards'>('table');

  // Sheet Tabs: 'all' | 'win' | 'loss' | 'summary'
  const [activeSheet, setActiveSheet] = useState<'all' | 'win' | 'loss' | 'summary'>('all');

  // Formula bar state
  const [selectedCell, setSelectedCell] = useState('A1');
  const [cellValue, setCellValue] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

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

  // Load from localStorage on mount (hanya sekali saat pertama buka)
  useEffect(() => {
    localStorage.removeItem('forex_trading_journal_data_v1');

    const loaded = getSavedTrades();
    setTrades(loaded);
    setHasUnsavedChanges(false);

    // Auto switch ke card view di HP
    if (window.innerWidth < 768) {
      setActiveView('cards');
    }
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
  }, [trades]);

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

  // When sheet changes to summary, open analytics modal
  useEffect(() => {
    if (activeSheet === 'summary') {
      setIsAnalyticsOpen(true);
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
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setHasUnsavedChanges(true);
    if (selectedTradeId === id) {
      setSelectedTradeId(null);
      setCellValue('');
    }
  };

  const handleSaveTrade = (savedTrade: Trade) => {
    setTrades((prev) => {
      const exists = prev.some((t) => t.id === savedTrade.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTrade.id ? savedTrade : t));
      } else {
        return [savedTrade, ...prev];
      }
    });
    setHasUnsavedChanges(true);
  };

  // Simpan Manual (Bukan Auto-Save)
  const handleManualSave = () => {
    saveTrades(trades);
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
      clearSavedTrades();
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
        setTrades((prev) => [...imported, ...prev]);
        setHasUnsavedChanges(true);
        alert(`Berhasil mengimpor ${imported.length} baris trade! Klik "Simpan" jika ingin menyimpannya.`);
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
        setTrades((prev) => [...imported, ...prev]);
        setHasUnsavedChanges(true);
        alert(`Berhasil me-restore ${imported.length} baris data trade dari file backup JSON! Klik "Simpan" untuk menyimpan permanen.`);
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
    setIsLiveChartOpen(true);
  };

  const handleSelectTickerPair = (pair: string) => {
    handleOpenLiveChart(pair);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-gray-800'} font-sans`}>
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

      {/* Excel Ribbon Top Header with Dropdown File & Ekspor */}
      <ExcelHeader
        documentTitle={documentTitle}
        onUpdateTitle={handleUpdateTitle}
        onOpenNewModal={handleAddNew}
        onOpenLiveChart={() => handleOpenLiveChart('EUR/USD')}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenLotCalc={() => setIsLotCalcOpen(true)}
        onOpenEcoCalendar={() => setIsEcoCalendarOpen(true)}
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
        onOpenCompounding={() => setIsCompoundingOpen(true)}
        onOpenStatementCard={() => setIsStatementCardOpen(true)}
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

      {/* Discipline Alert Banner (Overtrading / Revenge Trade / Loss Streak) */}
      <DisciplineAlertBanner warnings={disciplineWarnings} />

      {/* REAL-TIME FEATURE 1: Running Forex & Gold Price Ticker */}
      {showLiveTicker && (
        <LiveTicker
          tickers={tickers}
          isLive={isLive}
          onSelectPair={handleSelectTickerPair}
        />
      )}

      {/* REAL-TIME FEATURE 2: Market Sessions Clock (London, NY, Tokyo, Sydney) */}
      {showMarketSessions && <MarketSessions />}

      {/* Formula Bar dengan Cell Coordinates, Search, & Quick Row Actions */}
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

      {/* Mini Stats Bar Summary */}
      <StatsBar trades={trades} />

      {/* Main Content: Table View (Excel Sheet) or Card View (Mobile) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'table' ? (
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
          />
        )}

        {/* Floating Action Button (FAB) for Mobile Quick Add */}
        <button
          onClick={handleAddNew}
          aria-label="Tambah Trade Baru"
          className="md:hidden fixed bottom-14 right-4 z-30 bg-excel-green hover:bg-excel-darkgreen text-white p-3.5 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </main>

      {/* Excel Sheet Tabs & Status Bar */}
      <ExcelFooter
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        filteredTrades={filteredTrades}
      />

      {/* Add / Edit Trade Modal Form */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        editingTrade={editingTrade}
      />

      {/* REAL-TIME FEATURE 3: Lot Size & Risk Calculator Modal (Support $10 & Cent Account) */}
      <LotCalculatorModal
        isOpen={isLotCalcOpen}
        onClose={() => setIsLotCalcOpen(false)}
      />

      {/* REAL-TIME FEATURE 4: Economic Calendar News Modal */}
      <EconomicCalendarModal
        isOpen={isEcoCalendarOpen}
        onClose={() => setIsEcoCalendarOpen(false)}
      />

      {/* REAL-TIME FEATURE 5: Live TradingView Real-Time Chart (Includes Login Account Link) */}
      <LiveChartModal
        isOpen={isLiveChartOpen}
        onClose={() => setIsLiveChartOpen(false)}
        initialPair={chartPair}
      />

      {/* FITUR 4: Heatmap Jam & Hari Trading Terbaik */}
      <HeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        trades={trades}
      />

      {/* FITUR 5: Simulator Target Compounding Modal */}
      <CompoundingModal
        isOpen={isCompoundingOpen}
        onClose={() => setIsCompoundingOpen(false)}
      />

      {/* FITUR 7: Trader Statement Performance Card */}
      <TraderStatementCardModal
        isOpen={isStatementCardOpen}
        onClose={() => setIsStatementCardOpen(false)}
        trades={trades}
        documentTitle={documentTitle}
      />

      {/* Deep Analytics & Fitur 8 Strategy Breakdown Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => {
          setIsAnalyticsOpen(false);
          if (activeSheet === 'summary') setActiveSheet('all');
        }}
        trades={trades}
      />
    </div>
  );
}
