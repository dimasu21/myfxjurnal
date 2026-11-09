import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trade, TradeFilter } from './types/trade';
import { getSavedTrades, saveTrades, INITIAL_TRADES } from './utils/storage';
import { exportToExcel, exportToCsv, importFromSpreadsheet } from './utils/exportImport';
import { ExcelHeader } from './components/ExcelHeader';
import { FormulaBar } from './components/FormulaBar';
import { StatsBar } from './components/StatsBar';
import { TradeTable } from './components/TradeTable';
import { MobileCardView } from './components/MobileCardView';
import { TradeModal } from './components/TradeModal';
import { ExcelFooter } from './components/ExcelFooter';
import { AnalyticsModal } from './components/AnalyticsModal';
import { Plus, BarChart2 } from 'lucide-react';

export default function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    sortBy: 'tanggal',
    sortOrder: 'desc',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = getSavedTrades();
    setTrades(loaded);
    setIsLoaded(true);

    // Auto switch to card view on smaller screens initially if desired
    if (window.innerWidth < 768) {
      setActiveView('cards');
    }
  }, []);

  // Save to localStorage whenever trades change
  useEffect(() => {
    if (isLoaded) {
      saveTrades(trades);
    }
  }, [trades, isLoaded]);

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

      // Search query (matches pair, alasan, evaluasi, emosi)
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matchPair = trade.pair.toLowerCase().includes(q);
        const matchAlasan = trade.alasan.toLowerCase().includes(q);
        const matchEvaluasi = trade.evaluasi?.toLowerCase().includes(q);
        const matchEmosi = trade.emosi?.toLowerCase().includes(q);
        if (!matchPair && !matchAlasan && !matchEvaluasi && !matchEmosi) {
          return false;
        }
      }

      return true;
    });
  }, [trades, activeSheet, filter]);

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
  };

  const handleResetSample = () => {
    if (confirm('Kembalikan data ke contoh awal tabel jurnal forex?')) {
      setTrades(INITIAL_TRADES);
      saveTrades(INITIAL_TRADES);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(trades);
  };

  const handleExportCsv = () => {
    exportToCsv(trades);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromSpreadsheet(file);
      if (imported.length > 0) {
        setTrades((prev) => [...imported, ...prev]);
        alert(`Berhasil mengimpor ${imported.length} catatan trade!`);
      } else {
        alert('Tidak ada data valid yang ditemukan dalam file.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengimpor file. Pastikan format file Excel/CSV sesuai.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-gray-800 font-sans">
      {/* Hidden File Input for Excel Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Excel Ribbon Top Header */}
      <ExcelHeader
        onOpenNewModal={handleAddNew}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onImportClick={handleImportClick}
        onResetSample={handleResetSample}
        activeView={activeView}
        setActiveView={setActiveView}
        totalTrades={trades.length}
      />

      {/* Formula Bar with Cell Coordinates & Search */}
      <FormulaBar
        selectedCell={selectedCell}
        cellValue={cellValue}
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

      {/* Deep Analytics & Trading Psychology Modal */}
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

