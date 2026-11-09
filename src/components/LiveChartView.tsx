import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CandlestickChart, 
  ExternalLink, 
  LogIn, 
  Sun, 
  Moon,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface LiveChartViewProps {
  onBack: () => void;
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
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: 'D' },
];

export const LiveChartView: React.FC<LiveChartViewProps> = ({
  onBack,
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  // TradingView Embed Widget URL
  const widgetUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(
    selectedSymbol
  )}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=${theme}&style=1&timezone=Asia%2FJakarta&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=id&utm_source=localhost`;

  // URL untuk membuka langsung di akun TradingView user
  const directTvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(selectedSymbol)}&interval=${interval}`;

  return (
    <div className="flex-1 flex flex-col bg-[#131722] text-slate-100 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="bg-[#1e222d] border-b border-[#2a2e39] px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Kembali ke lembar kerja Excel (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Sheet</span>
          </button>

          <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />

          {/* Symbol Selector */}
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-[#2a2e39] text-white border border-[#363a45] rounded-lg px-2.5 py-1 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500"
          >
            {POPULAR_PAIRS.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Timeframe selector */}
          <div className="hidden sm:flex bg-[#2a2e39] p-0.5 rounded-lg text-xs font-semibold font-mono">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  interval === tf.value
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions: Theme Toggle & Login Akun TradingView */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            className="p-1.5 rounded-lg bg-[#2a2e39] hover:bg-[#363a45] text-slate-300 hover:text-white transition-colors"
            title={theme === 'light' ? 'Beralih ke Dark Theme' : 'Beralih ke Light Theme'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </button>

          <a
            href={directTvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs"
            title="Buka chart langsung di website TradingView dengan indikator & akun login Anda"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Login Akun TradingView</span>
            <span className="sm:hidden">TradingView</span>
            <ExternalLink className="w-3 h-3 text-blue-200" />
          </a>
        </div>
      </div>

      {/* Chart Canvas: Full viewport */}
      <div className="flex-1 w-full relative">
        <iframe
          key={`${selectedSymbol}-${interval}-${theme}`}
          title="TradingView Real-Time Chart"
          src={widgetUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="fullscreen"
        />
      </div>
    </div>
  );
};
