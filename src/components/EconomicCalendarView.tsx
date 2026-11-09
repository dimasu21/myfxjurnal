import React, { useState, useEffect } from 'react';
import { generateMultiDayEconomicCalendar } from '../utils/forexHelpers';
import { EconomicEvent } from '../types/realtime';
import { ArrowLeft, Search, Clock } from 'lucide-react';

interface EconomicCalendarViewProps {
  onBack: () => void;
}

const IMPACT_CONFIG = {
  HIGH: { label: 'HIGH', bg: 'bg-red-500', text: 'text-white' },
  MEDIUM: { label: 'MED', bg: 'bg-amber-500', text: 'text-white' },
  LOW: { label: 'LOW', bg: 'bg-green-500', text: 'text-white' },
} as const;

const CURRENCY_FLAG: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
  AUD: '🇦🇺', CAD: '🇨🇦', NZD: '🇳🇿', CHF: '🇨🇭',
  CNY: '🇨🇳', SGD: '🇸🇬',
};

export const EconomicCalendarView: React.FC<EconomicCalendarViewProps> = ({ onBack }) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | 'ALL' | 'TRADINGVIEW'>(0);
  const [filterImpact, setFilterImpact] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [events, setEvents] = useState<EconomicEvent[]>([]);

  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setEvents(generateMultiDayEconomicCalendar(now));
    };
    refresh();
    const timer = setInterval(refresh, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Build day labels dynamically
  const buildDayLabel = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    if (offset === 0) return 'Today';
    if (offset === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const daysTab = [
    { offset: 0 as const, label: buildDayLabel(0) },
    { offset: 1 as const, label: buildDayLabel(1) },
    { offset: 2 as const, label: buildDayLabel(2) },
    { offset: 3 as const, label: buildDayLabel(3) },
    { offset: 'TRADINGVIEW' as const, label: 'TradingView' },
  ];

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

  // Group events by dateLabel
  const grouped: Record<string, EconomicEvent[]> = {};
  filteredEvents.forEach((ev) => {
    const key = ev.dateLabel || 'Other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  const impactCfg = (impact: string) =>
    IMPACT_CONFIG[impact as keyof typeof IMPACT_CONFIG] || {
      label: impact,
      bg: 'bg-gray-400',
      text: 'text-white',
    };

  const countdownStyle = (cd: string) => {
    if (cd.includes('Rilis <'))
      return 'text-red-600 dark:text-red-400 font-bold animate-pulse';
    if (cd.includes('lalu') || cd.includes('Sudah'))
      return 'text-gray-400 dark:text-slate-500';
    return 'text-blue-600 dark:text-blue-400 font-semibold';
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f8] dark:bg-[#0b1120] text-gray-900 dark:text-slate-100 overflow-hidden">

      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20">

        {/* Row 1: Back + Title + Clock */}
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors"
              title="Kembali (Esc)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                Economic Calendar
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold">Real Time</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
            <span className="font-mono text-xs font-bold text-gray-700 dark:text-slate-200">
              {currentTime} WIB
            </span>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, currency, country..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 3: Day Tabs */}
        <div className="flex overflow-x-auto scrollbar-none border-t border-gray-100 dark:border-slate-800">
          {daysTab.map((tab) => (
            <button
              key={String(tab.offset)}
              type="button"
              onClick={() => setSelectedDayOffset(tab.offset)}
              className={`shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                selectedDayOffset === tab.offset
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Row 4: Impact filter pills */}
        {selectedDayOffset !== 'TRADINGVIEW' && (
          <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'HIGH', label: 'High' },
              { key: 'MEDIUM', label: 'Medium' },
              { key: 'LOW', label: 'Low' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterImpact(f.key)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  filterImpact === f.key
                    ? f.key === 'HIGH'
                      ? 'bg-red-500 border-red-500 text-white'
                      : f.key === 'MEDIUM'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : f.key === 'LOW'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-transparent border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}

            <div className="ml-auto shrink-0">
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="text-xs bg-transparent border border-gray-300 dark:border-slate-700 rounded-lg px-2 py-1 text-gray-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Currencies</option>
                {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'NZD', 'CHF'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {selectedDayOffset === 'TRADINGVIEW' ? (
          <div className="p-4 h-full">
            <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800">
              <iframe
                title="TradingView Economic Calendar"
                src="https://s.tradingview.com/embed-widget/events/?locale=id#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22importanceFilter%22%3A%220%2C1%22%7D"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500 gap-2">
            <span className="text-sm">Tidak ada event ditemukan</span>
            <span className="text-xs">Coba ubah filter atau pilih hari lain</span>
          </div>
        ) : (
          <div className="pb-6">
            {Object.entries(grouped).map(([dateLabel, dayEvents]) => (
              <div key={dateLabel}>
                {/* Date separator */}
                <div className="sticky top-0 z-10 px-4 py-2 bg-gray-200 dark:bg-slate-800/90 backdrop-blur-sm">
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">
                    {dateLabel}
                  </span>
                </div>

                {/* Event cards */}
                <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
                  {dayEvents.map((ev) => {
                    const cfg = impactCfg(ev.impact);
                    const flag = CURRENCY_FLAG[ev.currency] || '';
                    const hasData = ev.forecast || ev.previous;
                    return (
                      <div
                        key={ev.id}
                        className="bg-white dark:bg-[#111827] px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Row 1: Time + Impact + Title + Currency */}
                        <div className="flex items-start gap-3">
                          {/* Time */}
                          <div className="shrink-0 w-14 text-right">
                            <span className="font-mono text-xs font-bold text-gray-700 dark:text-slate-200">
                              {ev.time}
                            </span>
                          </div>

                          {/* Impact dot */}
                          <div className="shrink-0 mt-0.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${cfg.bg}`} />
                          </div>

                          {/* Title + country */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                              {ev.title}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                              {ev.country}
                            </p>
                          </div>

                          {/* Currency + flag */}
                          <div className="shrink-0 flex flex-col items-end gap-1">
                            <span className="text-sm">{flag}</span>
                            <span className="font-mono text-[11px] font-bold text-gray-700 dark:text-slate-300">
                              {ev.currency}
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Impact badge + data + countdown */}
                        <div className="flex items-center gap-2 mt-2 ml-[68px]">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>

                          {hasData && (
                            <span className="text-[11px] text-gray-500 dark:text-slate-400">
                              {ev.forecast && <>Cons: <span className="text-gray-700 dark:text-slate-300 font-medium">{ev.forecast}</span></>}
                              {ev.forecast && ev.previous && <span className="mx-1.5 text-gray-300 dark:text-slate-700">·</span>}
                              {ev.previous && <>Prev: <span className="text-gray-700 dark:text-slate-300 font-medium">{ev.previous}</span></>}
                            </span>
                          )}

                          <span className={`ml-auto text-[11px] ${countdownStyle(ev.countdown)}`}>
                            {ev.countdown}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
