import React, { useState, useEffect } from 'react';
import { generateMultiDayEconomicCalendar } from '../utils/forexHelpers';
import { EconomicEvent } from '../types/realtime';
import { 
  Calendar, 
  AlertCircle, 
  Clock, 
  X, 
  Filter, 
  Radio, 
  ExternalLink,
  Flame,
  Globe2,
  RefreshCw,
  Search
} from 'lucide-react';

interface EconomicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | 'ALL' | 'TRADINGVIEW'>('ALL');
  const [filterImpact, setFilterImpact] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [events, setEvents] = useState<EconomicEvent[]>([]);

  // Update clock & events every minute
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  if (!isOpen) return null;

  // Unique days info for tabs
  const daysTab = [
    { offset: 'ALL' as const, label: 'Semua' },
    { offset: 0, label: events.find((e) => e.dayOffset === 0)?.dateLabel || 'Hari 1' },
    { offset: 1, label: events.find((e) => e.dayOffset === 1)?.dateLabel || 'Hari 2' },
    { offset: 2, label: events.find((e) => e.dayOffset === 2)?.dateLabel || 'Hari 3' },
    { offset: 3, label: events.find((e) => e.dayOffset === 3)?.dateLabel || 'Hari 4' },
    { offset: 'TRADINGVIEW' as const, label: 'TradingView Live' },
  ];

  const filteredEvents = events.filter((ev) => {
    // Day filter
    if (selectedDayOffset !== 'ALL' && selectedDayOffset !== 'TRADINGVIEW') {
      if (ev.dayOffset !== selectedDayOffset) return false;
    }

    // Impact filter
    if (filterImpact !== 'ALL' && ev.impact !== filterImpact) return false;

    // Currency filter
    if (filterCurrency !== 'ALL' && ev.currency !== filterCurrency) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchCur = ev.currency.toLowerCase().includes(q);
      const matchCountry = ev.country.toLowerCase().includes(q);
      if (!matchTitle && !matchCur && !matchCountry) return false;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs text-gray-800 dark:text-slate-100 flex flex-col max-h-[92vh] transition-colors">
        
        {/* Header Bar */}
        <div className="bg-excel-green dark:bg-slate-900 px-4 py-3 text-white flex items-center justify-between border-b border-white/10 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Kalender Berita Ekonomi Forex Real-Time</h3>
                <span className="hidden sm:inline-flex items-center gap-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                  <Radio className="w-2.5 h-2.5 text-white animate-pulse" /> Real Time
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 dark:text-slate-400">
                Jadwal rilis berita global (CPI, NFP, Suku Bunga) dengan waktu rilis akurat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Clock Indicator */}
            <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] bg-black/20 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Tabs (Flex-wrap agar semua pill muat rapi tanpa terpotong) */}
        <div className="bg-gray-100 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 px-3 py-2 flex flex-wrap items-center gap-1.5">
          {daysTab.map((tab) => (
            <button
              key={String(tab.offset)}
              onClick={() => setSelectedDayOffset(tab.offset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedDayOffset === tab.offset
                  ? 'bg-excel-green text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {tab.offset === 'TRADINGVIEW' ? (
                <Globe2 className="w-3.5 h-3.5 text-cyan-300" />
              ) : tab.offset === 0 ? (
                <Flame className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Calendar className="w-3.5 h-3.5 opacity-60" />
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls (Hanya muncul jika bukan mode TradingView widget) */}
        {selectedDayOffset !== 'TRADINGVIEW' && (
          <div className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Cari berita (misal: CPI, NFP, Powell)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-excel-green"
              />
            </div>

            {/* Impact Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium mr-1">Dampak:</span>
              {[
                { key: 'ALL', label: 'Semua' },
                { key: 'HIGH', label: '🔴 High' },
                { key: 'MEDIUM', label: '🟠 Med' },
                { key: 'LOW', label: '🟡 Low' },
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => setFilterImpact(lvl.key)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                    filterImpact === lvl.key
                      ? 'bg-excel-green text-white border-excel-green'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Currency Filter */}
            <select
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-excel-green"
            >
              <option value="ALL">Semua Mata Uang</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="JPY">🇯🇵 JPY</option>
              <option value="AUD">🇦🇺 AUD</option>
            </select>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin">
          {selectedDayOffset === 'TRADINGVIEW' ? (
            /* OFFICIAL TRADINGVIEW LIVE ECONOMIC CALENDAR EMBED */
            <div className="h-[60vh] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 relative bg-white dark:bg-slate-900">
              <iframe
                title="TradingView Economic Calendar Live"
                src="https://s.tradingview.com/embed-widget/events/?locale=id#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22importanceFilter%22%3A%220%2C1%22%2C%22countryFilter%22%3A%22us%2Ceu%2Cgb%2Cjp%2Cca%2Cau%2Cch%22%7D"
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* MULTI-DAY NATIVE REAL-TIME CALENDAR TABLE */
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-sm">Tidak ada berita yang cocok dengan filter Anda.</p>
                  <p className="text-xs text-gray-400 mt-1">Coba ganti filter dampak atau kata kunci pencarian.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-[11px] font-semibold">
                        <th className="pb-2 pl-2">Tanggal & Waktu</th>
                        <th className="pb-2">Mata Uang</th>
                        <th className="pb-2">Dampak</th>
                        <th className="pb-2">Berita / Event Ekonomi</th>
                        <th className="pb-2 text-center">Status / Countdown</th>
                        <th className="pb-2 text-right">Rilis</th>
                        <th className="pb-2 text-right">Prediksi</th>
                        <th className="pb-2 text-right pr-2">Sebelumnya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredEvents.map((ev) => {
                        const isHigh = ev.impact === 'HIGH';
                        const isMed = ev.impact === 'MEDIUM';

                        return (
                          <tr
                            key={ev.id}
                            className={`transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/60 ${
                              isHigh ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                            }`}
                          >
                            {/* Date & Time */}
                            <td className="py-2.5 pl-2 font-mono text-gray-700 dark:text-slate-300 font-medium whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-sans font-semibold">
                                  {ev.dateFormatted}
                                </span>
                                <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-slate-100 text-xs">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  {ev.time}
                                </span>
                              </div>
                            </td>

                            {/* Currency + Flag */}
                            <td className="py-2.5 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                              <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700">
                                <span>{ev.flag}</span>
                                <span className="font-mono text-xs">{ev.currency}</span>
                              </div>
                            </td>

                            {/* Impact */}
                            <td className="py-2.5 whitespace-nowrap">
                              {isHigh ? (
                                <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 font-extrabold px-1.5 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                  HIGH
                                </span>
                              ) : isMed ? (
                                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                                  MED
                                </span>
                              ) : (
                                <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400 border border-gray-300 dark:border-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                  LOW
                                </span>
                              )}
                            </td>

                            {/* Event Title */}
                            <td className="py-2.5 font-medium text-gray-800 dark:text-slate-200 pr-2">
                              <div className="font-semibold text-xs text-gray-900 dark:text-white">
                                {ev.title}
                              </div>
                              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-sans">
                                {ev.country}
                              </span>
                            </td>

                            {/* Live Countdown & Status */}
                            <td className="py-2.5 text-center whitespace-nowrap">
                              {ev.status === 'IMMINENT' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full animate-bounce shadow-xs">
                                  {ev.countdown}
                                </span>
                              ) : ev.status === 'RELEASED' ? (
                                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                                  {ev.countdown}
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-medium">
                                  {ev.countdown}
                                </span>
                              )}
                            </td>

                            {/* Actual */}
                            <td className="py-2.5 text-right font-mono font-extrabold text-gray-900 dark:text-white">
                              {ev.actual !== '-' ? (
                                <span className="text-emerald-700 dark:text-emerald-400">{ev.actual}</span>
                              ) : (
                                <span className="text-gray-400 dark:text-slate-600">—</span>
                              )}
                            </td>

                            {/* Forecast */}
                            <td className="py-2.5 text-right font-mono text-gray-600 dark:text-slate-400">
                              {ev.forecast}
                            </td>

                            {/* Previous */}
                            <td className="py-2.5 text-right font-mono text-gray-400 dark:text-slate-500 pr-2">
                              {ev.previous}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Warning & Action */}
        <div className="bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/60 p-3 text-[11px] text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aturan Manajemen Risiko:</strong> Hindari posisi baru <strong>15 menit sebelum & sesudah rilis HIGH IMPACT</strong> untuk mencegah slippage spread broker.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-auto px-4 py-1.5 bg-excel-green hover:bg-excel-darkgreen text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs"
          >
            Tutup Kalender
          </button>
        </div>
      </div>
    </div>
  );
};
