import React, { useState, useEffect } from 'react';
import { 
  MonthlyArchive, 
  getMonthlyArchives, 
  manualArchiveCurrentSheet, 
  saveMonthlyArchives 
} from '../utils/monthlyArchive';
import { Trade } from '../types/trade';
import { exportToExcel, exportToPdf, exportToJson } from '../utils/exportImport';
import { 
  Archive, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle,
  FolderOpen
} from 'lucide-react';

interface MonthlyHistoryViewProps {
  currentTrades: Trade[];
  onLoadTradesToSheet: (trades: Trade[]) => void;
  onBackToMainSheet: () => void;
}

export const MonthlyHistoryView: React.FC<MonthlyHistoryViewProps> = ({
  currentTrades,
  onLoadTradesToSheet,
  onBackToMainSheet,
}) => {
  const [archives, setArchives] = useState<MonthlyArchive[]>([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [archiveSuccessMsg, setArchiveSuccessMsg] = useState<string | null>(null);

  // Load archives on mount
  useEffect(() => {
    const loaded = getMonthlyArchives();
    setArchives(loaded);
    if (loaded.length > 0) {
      setSelectedMonthKey(loaded[0].monthKey);
    }
  }, []);

  // Handle manual archive current sheet
  const handleArchiveCurrent = () => {
    if (currentTrades.length === 0) {
      alert('Sheet aktif masih kosong. Isi beberapa trade terlebih dahulu untuk membuat arsip riwayat.');
      return;
    }

    const newArch = manualArchiveCurrentSheet(currentTrades);
    const updated = getMonthlyArchives();
    setArchives(updated);
    setSelectedMonthKey(newArch.monthKey);

    setArchiveSuccessMsg(`Berhasil mengarsipkan ${currentTrades.length} trade untuk ${newArch.monthLabel}!`);
    setTimeout(() => setArchiveSuccessMsg(null), 3000);
  };

  // Handle delete archive
  const handleDeleteArchive = (monthKey: string, monthLabel: string) => {
    if (confirm(`Hapus arsip history untuk ${monthLabel}?`)) {
      const filtered = archives.filter((a) => a.monthKey !== monthKey);
      setArchives(filtered);
      saveMonthlyArchives(filtered);
      if (selectedMonthKey === monthKey) {
        setSelectedMonthKey(filtered[0]?.monthKey || null);
      }
    }
  };

  const selectedArchive = archives.find((a) => a.monthKey === selectedMonthKey) || null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0b1120] text-gray-800 dark:text-slate-100 transition-colors">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-white dark:bg-[#111827] border-b border-gray-300 dark:border-slate-800 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                History Jurnal & Arsip Bulanan
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Penyimpanan riwayat performa per bulan yang otomatis diarsipkan setiap pergantian bulan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleArchiveCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Ambil snapshot dan arsipkan data sheet aktif saat ini"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Arsipkan Bulan Ini</span>
          </button>

          <button
            onClick={onBackToMainSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-gray-300 dark:border-slate-700 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-gray-500" />
            <span>Kembali ke Sheet Aktif</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {archiveSuccessMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            {archiveSuccessMsg}
          </span>
        </div>
      )}

      {/* Main Content Layout (Sidebar of Months + Detail Panel) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: Month Archives List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-300 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-y-auto p-3 space-y-2.5">
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-1">
            Daftar Bulan Tersimpan ({archives.length})
          </div>

          {archives.length === 0 ? (
            <div className="p-6 text-center text-gray-400 dark:text-slate-500 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl my-2">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-xs text-gray-700 dark:text-slate-300">Belum Ada Arsip Bulanan</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                Sistem akan otomatis mengarsipkan jurnal tiap ganti bulan, atau Anda bisa klik tombol "Arsipkan Bulan Ini" di atas.
              </p>
              <button
                onClick={handleArchiveCurrent}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold"
              >
                <Plus className="w-3 h-3" /> Arsipkan Sekarang
              </button>
            </div>
          ) : (
            archives.map((arch) => {
              const isSelected = selectedMonthKey === arch.monthKey;
              const isProfit = arch.stats.totalPips >= 0;

              return (
                <div
                  key={arch.monthKey}
                  onClick={() => setSelectedMonthKey(arch.monthKey)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      {arch.monthLabel}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {arch.isAutoArchived ? 'Otomatis' : 'Manual'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-gray-200 dark:border-slate-700">
                    <div className="bg-white dark:bg-slate-800 p-1 rounded border border-gray-100 dark:border-slate-700">
                      <span className="text-gray-400 block">Win Rate</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        {arch.stats.winRate}%
                      </strong>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-1 rounded border border-gray-100 dark:border-slate-700">
                      <span className="text-gray-400 block">Net Pips</span>
                      <strong
                        className={`font-bold font-mono ${
                          isProfit ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {isProfit ? `+${arch.stats.totalPips}` : arch.stats.totalPips}p
                      </strong>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-1 rounded border border-gray-100 dark:border-slate-700">
                      <span className="text-gray-400 block">Trades</span>
                      <strong className="text-gray-800 dark:text-slate-200 font-bold font-mono">
                        {arch.stats.totalTrades}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Month Detail & Trade Table */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
          {selectedArchive ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Month Detail Header */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                      {selectedArchive.monthLabel}
                    </h3>
                    <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                      {selectedArchive.trades.length} Catatan Trade
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Diarsipkan pada: {selectedArchive.archivedAt}
                  </p>
                </div>

                {/* Actions for this Month */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => {
                      exportToExcel(selectedArchive.trades, `Jurnal_Forex_${selectedArchive.monthKey}.xlsx`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-excel-green text-white rounded text-xs font-semibold hover:bg-excel-darkgreen shadow-xs transition-colors"
                    title="Export arsip bulan ini ke Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={() => {
                      exportToPdf(selectedArchive.trades, `Laporan_Forex_${selectedArchive.monthKey}.pdf`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700 shadow-xs transition-colors"
                    title="Export arsip bulan ini ke PDF"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Muat ${selectedArchive.trades.length} data trade dari ${selectedArchive.monthLabel} ke lembar sheet utama?`
                        )
                      ) {
                        onLoadTradesToSheet(selectedArchive.trades);
                        onBackToMainSheet();
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors"
                    title="Muat data ini ke lembar kerja sheet utama untuk diedit/dianalisa"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Buka di Sheet Utama</span>
                  </button>

                  <button
                    onClick={() => handleDeleteArchive(selectedArchive.monthKey, selectedArchive.monthLabel)}
                    className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    title="Hapus arsip bulan ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Month Statistics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-xs">
                <div className="bg-gray-50 dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Win Rate</span>
                  <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {selectedArchive.stats.winRate}%{' '}
                    <span className="text-[10px] text-gray-500 font-normal">
                      ({selectedArchive.stats.winTrades}W / {selectedArchive.stats.lossTrades}L)
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Total Pips Bersih</span>
                  <div
                    className={`text-base font-extrabold mt-0.5 ${
                      selectedArchive.stats.totalPips >= 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {selectedArchive.stats.totalPips > 0
                      ? `+${selectedArchive.stats.totalPips}`
                      : selectedArchive.stats.totalPips}{' '}
                    <span className="text-[10px] font-normal">Pips</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Est. P&L</span>
                  <div className="text-base font-extrabold text-blue-700 dark:text-blue-400 mt-0.5">
                    {selectedArchive.stats.totalPnL >= 0
                      ? `+$${selectedArchive.stats.totalPnL}`
                      : `-$${Math.abs(selectedArchive.stats.totalPnL)}`}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Profit Factor</span>
                  <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                    {selectedArchive.stats.profitFactor}
                  </div>
                </div>
              </div>

              {/* Table of Trades for this Month */}
              <div className="flex-1 overflow-auto p-3 scrollbar-thin">
                <table className="w-full border-collapse text-xs text-left">
                  <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold sticky top-0 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2 w-12 text-center">#</th>
                      <th className="p-2">Tanggal</th>
                      <th className="p-2">Pair</th>
                      <th className="p-2">Posisi</th>
                      <th className="p-2 text-right">Entry</th>
                      <th className="p-2 text-right">SL</th>
                      <th className="p-2 text-right">TP</th>
                      <th className="p-2 text-center">Lot</th>
                      <th className="p-2 text-center">Hasil</th>
                      <th className="p-2">Alasan & Strategi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-800 font-mono">
                    {selectedArchive.trades.map((t, idx) => {
                      const isWin = t.pips > 0;
                      const isLoss = t.pips < 0;

                      return (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-850">
                          <td className="p-2 text-center text-gray-400">{idx + 1}</td>
                          <td className="p-2 whitespace-nowrap text-gray-700 dark:text-slate-300">
                            {t.tanggal}
                          </td>
                          <td className="p-2 font-bold text-gray-900 dark:text-white">
                            {t.pair}
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                t.posisi === 'BUY'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {t.posisi}
                            </span>
                          </td>
                          <td className="p-2 text-right">{t.entry}</td>
                          <td className="p-2 text-right text-rose-600">{t.sl}</td>
                          <td className="p-2 text-right text-emerald-600">{t.tp}</td>
                          <td className="p-2 text-center">{t.lot}</td>
                          <td
                            className={`p-2 text-center font-bold ${
                              isWin
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : isLoss
                                ? 'text-rose-700 dark:text-rose-400'
                                : 'text-gray-500'
                            }`}
                          >
                            {isWin ? `+${t.pips}` : t.pips}p
                          </td>
                          <td className="p-2 font-sans truncate max-w-xs text-gray-600 dark:text-slate-400">
                            {t.strategi && (
                              <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1 rounded mr-1">
                                {t.strategi}
                              </span>
                            )}
                            {t.alasan}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400 dark:text-slate-500">
              <div>
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-sm">Pilih bulan di sebelah kiri untuk melihat arsip detail.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

