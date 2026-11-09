import React, { useState } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, CandlestickChart } from 'lucide-react';

interface LiveChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPair?: string;
}

const POPULAR_PAIRS = [
  { label: 'EUR/USD', symbol: 'FX:EURUSD' },
  { label: 'GBP/USD', symbol: 'FX:GBPUSD' },
  { label: 'USD/JPY', symbol: 'FX:USDJPY' },
  { label: 'XAU/USD (Gold)', symbol: 'OANDA:XAUUSD' },
  { label: 'AUD/USD', symbol: 'FX:AUDUSD' },
  { label: 'USD/CAD', symbol: 'FX:USDCAD' },
  { label: 'USD/CHF', symbol: 'FX:USDCHF' },
  { label: 'NZD/USD', symbol: 'FX:NZDUSD' },
  { label: 'BTC/USD', symbol: 'BINANCE:BTCUSDT' },
];

const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1J (1H)', value: '60' },
  { label: '4J (4H)', value: '240' },
  { label: '1H (1D)', value: 'D' },
];

export const LiveChartModal: React.FC<LiveChartModalProps> = ({
  isOpen,
  onClose,
  initialPair = 'EUR/USD',
}) => {
  const getInitialSymbol = () => {
    const clean = initialPair.toUpperCase().trim();
    if (clean.includes('XAU') || clean.includes('GOLD')) return 'OANDA:XAUUSD';
    if (clean.includes('BTC')) return 'BINANCE:BTCUSDT';
    const found = POPULAR_PAIRS.find((p) => p.label.startsWith(clean));
    return found ? found.symbol : `FX:${clean.replace('/', '')}`;
  };

  const [selectedSymbol, setSelectedSymbol] = useState(getInitialSymbol());
  const [interval, setInterval] = useState('15');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen) return null;

  // TradingView Embed Widget URL
  const widgetUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(
    selectedSymbol
  )}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=${theme}&style=1&timezone=Asia%2FJakarta&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=id&utm_source=localhost`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 overflow-hidden animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden transition-all ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[88vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="bg-[#107c41] px-3 py-2 text-white flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded">
              <CandlestickChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>TradingView Live Chart</span>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-200 px-1.5 py-0.2 rounded font-mono font-normal">
                  Real-Time Candlestick
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle inside Chart */}
            <button
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="text-[11px] px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 transition-colors"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen((prev) => !prev)}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10"
              title={isFullScreen ? 'Perkecil Layar' : 'Layar Penuh'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10"
              title="Tutup Chart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart Toolbar: Pair Selector & Timeframe */}
        <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
          {/* Quick Pairs */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-semibold text-gray-600 text-[11px] mr-1">Pair:</span>
            {POPULAR_PAIRS.map((p) => (
              <button
                key={p.symbol}
                onClick={() => setSelectedSymbol(p.symbol)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  selectedSymbol === p.symbol
                    ? 'bg-excel-green text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-semibold text-gray-600 text-[11px] mr-1 hidden sm:inline">TF:</span>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  interval === tf.value
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live TradingView Iframe */}
        <div className="flex-1 w-full h-full bg-white relative">
          <iframe
            key={`${selectedSymbol}-${interval}-${theme}`}
            src={widgetUrl}
            title="TradingView Live Chart"
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-200 px-3 py-1 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>
            Simbol Aktif: <strong className="text-gray-800">{selectedSymbol}</strong> | Timeframe: <strong>{interval}</strong>
          </span>
          <span className="hidden sm:inline">
            Didukung oleh Official TradingView Advanced Charts (Zero Lag & Real-Time)
          </span>
        </div>
      </div>
    </div>
  );
};
