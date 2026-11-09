import React, { useState, useEffect } from 'react';
import { generateMultiDayEconomicCalendar } from '../utils/forexHelpers';
import { EconomicEvent } from '../types/realtime';
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  Filter, 
  ExternalLink,
  RefreshCw,
  Search,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface EconomicCalendarViewProps {
  onBack: () => void;
}

export const EconomicCalendarView: React.FC<EconomicCalendarViewProps> = ({
  onBack,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | 'ALL' | 'TRADINGVIEW'>('ALL');
  const [filterImpact, setFilterImpact] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [events, setEvents] = useState<EconomicEvent[]>([]);

  // Update clock & events every second
  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
      setEvents(generateMultiDayEconomicCalendar(now));
    };

    refresh();
    const timer = setInterval(refresh, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Unique days info for tabs
  const daysTab = [
    { offset: 'ALL' as const, label: 'Semua Jadwal' },
    { offset: 0, label: 'Hari Ini' },
    { offset: 1, label: 'Besok' },
    { offset: 2, label: 'H+2' },
    { offset: 3, label: 'H+3' },
    { offset: 'TRADINGVIEW' as const, label: 'TradingView Live Feed' },
  ];

  // Filtering
  const filteredEvents = events.filter((ev) => {
    if (selectedDayOffset !== 'ALL' && selectedDayOffset !== 'TRADINGVIEW') {
      if (ev.dayOffset !== selectedDayOffset) return false;
    }
    if (filterImpact !== 'ALL' && ev.impact !== filterImpact) return false;
    if (filterCurrency !== 'ALL' && ev.currency !== filterCurrency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ev.title.toLowerCase().includes(q) ||
        ev.currency.toLowerCase().includes(q) ||
        ev.country.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-800 dark:text-slate-100 overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
            title="Kembali ke lembar kerja Excel (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Sheet</span>
          </button>
          <div className="h-5 w-[1px] bg-gray-300 dark:bg-slate-700 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Kalender Berita Ekonomi Forex
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real Time
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Jadwal rilis data makro ekonomi global (CPI, Non-Farm Payrolls, Suku Bunga FOMC/ECB/BOJ)
            </p>
          </div>
        </div>

        {/* Real-time Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs font-mono font-bold text-gray-700 dark:text-slate-200">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{currentTime || 'Loading...'}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200 dark:border-slate-800">
          {daysTab.map((tab) => (
            <button
              key={String(tab.offset)}
              type="button"
              onClick={() => setSelectedDayOffset(tab.offset)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all shrink-0 border-b-2 ${
                selectedDayOffset === tab.offset
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 shadow-xs'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on tab */}
        {selectedDayOffset === 'TRADINGVIEW' ? (
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                Official Real-Time Economic Calendar Widget by TradingView
              </span>
              <a
                href="https://www.tradingview.com/economic-calendar/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
              >
                <span>Buka di TradingView</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full h-[650px] rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800">
              <iframe
                title="TradingView Economic Calendar"
                src="https://s.tradingview.com/embed-widget/events/?locale=id#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22importanceFilter%22%3A%220%2C1%22%7D"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[200px] sm:min-w-[260px]">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari rilis berita (e.g. CPI, NFP, Fed)..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Impact Filter */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
                  <span className="text-gray-400 px-1 text-[11px]">Dampak:</span>
                  {[
                    { key: 'ALL', label: 'Semua' },
                    { key: 'HIGH', label: 'High' },
                    { key: 'MEDIUM', label: 'Med' },
                    { key: 'LOW', label: 'Low' },
                  ].map((imp) => (
                    <button
                      key={imp.key}
                      type="button"
                      onClick={() => setFilterImpact(imp.key)}
                      className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                        filterImpact === imp.key
                          ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-800 dark:text-slate-400'
                      }`}
                    >
                      {imp.label}
                    </button>
                  ))}
                </div>

                {/* Currency Filter */}
                <select
                  value={filterCurrency}
                  onChange={(e) => setFilterCurrency(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">Semua Mata Uang</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="JPY">JPY (Japanese Yen)</option>
                  <option value="AUD">AUD (Australian Dollar)</option>
                  <option value="CAD">CAD (Canadian Dollar)</option>
                </select>
              </div>

              <div className="text-xs text-gray-500 dark:text-slate-400">
                Menampilkan <strong className="text-gray-900 dark:text-white">{filteredEvents.length}</strong> jadwal
              </div>
            </div>

            {/* Events Table / Responsive Cards */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-800 text-[11px] uppercase font-bold text-gray-500 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Hari & Jam (WIB)</th>
                      <th className="px-3 py-3">Mata Uang</th>
                      <th className="px-3 py-3">Dampak</th>
                      <th className="px-4 py-3">Peristiwa / Rilis Berita</th>
                      <th className="px-3 py-3 text-right">Perkiraan</th>
                      <th className="px-3 py-3 text-right">Sebelumnya</th>
                      <th className="px-4 py-3 text-center">Status / Countdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-sans">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">
                          Tidak ada agenda berita yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((ev) => (
                        <tr
                          key={ev.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-bold text-gray-900 dark:text-white font-mono">{ev.time}</span>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500 block">{ev.dateLabel}</span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200">
                              {ev.currency}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ev.impact === 'HIGH'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                                  : ev.impact === 'MEDIUM'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {ev.impact}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <strong className="block text-gray-900 dark:text-white">{ev.title}</strong>
                            <span className="text-[11px] text-gray-500 dark:text-slate-400">{ev.country}</span>
                          </td>
                          <td className="px-3 py-3 text-right font-mono font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
                            {ev.forecast}
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-gray-500 dark:text-slate-400 whitespace-nowrap">
                            {ev.previous}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                                ev.countdown.includes('Rilis <')
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : ev.countdown.includes('Sudah Rilis') || ev.countdown.includes('lalu')
                                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono'
                              }`}
                            >
                              {ev.countdown}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
