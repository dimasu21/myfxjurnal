import React, { useState, useEffect } from 'react';
import { getTradingSessions } from '../utils/forexHelpers';
import { TradingSession } from '../types/realtime';
import { Globe2, Clock, Zap } from 'lucide-react';

export const MarketSessions: React.FC = () => {
  const [sessions, setSessions] = useState<TradingSession[]>(getTradingSessions());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setSessions(getTradingSessions(now));
      setCurrentTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Count active sessions (overlap detection)
  const openCount = sessions.filter((s) => s.status === 'OPEN').length;
  const isOverlap = openCount >= 2;

  return (
    <div className="bg-white border-b border-gray-300 px-3 py-2 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <Globe2 className="w-4 h-4 text-excel-green" />
          <span>Sesi Pasar Forex Dunia (Real-Time)</span>
          {isOverlap && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-300 animate-pulse">
              <Zap className="w-3 h-3 text-amber-600" /> Overlap Sesi: Volatilitas Tinggi!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-gray-600 text-[11px] bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
          <Clock className="w-3 h-3 text-gray-500" />
          <span>Waktu Anda: <strong className="text-gray-900">{currentTimeStr}</strong></span>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sessions.map((s) => {
          const isOpen = s.status === 'OPEN';
          return (
            <div
              key={s.name}
              className={`p-2.5 rounded-lg border transition-all ${
                isOpen
                  ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/50 shadow-xs'
                  : 'bg-gray-50/70 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-xs flex items-center gap-1">
                  <span>{s.flag}</span>
                  <span>{s.name}</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                    isOpen
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {isOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>

              <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
                <span>{s.city}</span>
                <span className="font-mono text-gray-600 font-medium">
                  {isOpen ? `Tutup: ${s.closesIn}` : `Buka: ${s.opensIn}`}
                </span>
              </div>

              {/* Progress bar inside session */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isOpen ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${isOpen ? s.progress : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

