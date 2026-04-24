import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useLivePrices } from '@/hooks/useLivePrices';

const TRACKED = [
  { sym: 'SPY', label: 'S&P' },
  { sym: 'QQQ', label: 'NDX' },
  { sym: 'DIA', label: 'DOW' },
  { sym: 'VIX', label: 'VIX' },
  { sym: 'EUR', label: 'EUR' },
  { sym: 'GLD', label: 'GOLD' },
  { sym: 'USO', label: 'OIL' },
  { sym: 'BTC', label: 'BTC' },
];

export const MarketIntelligenceHub = () => {
  const live = useLivePrices(TRACKED.map(t => t.sym));

  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">Market Intelligence</h3>
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3 text-[hsl(var(--terminal-blue))] animate-pulse" />
          <span className="text-[9px] font-mono text-[hsl(var(--terminal-blue))]">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="grid grid-cols-4 gap-1">
          {TRACKED.map(({ sym, label }) => {
            const q = live[sym];
            const value = q?.price ?? 0;
            const changePct = q?.changePct ?? 0;
            const positive = changePct >= 0;
            return (
              <div key={sym} className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1 rounded transition-colors">
                <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-0.5">{label}</div>
                <div className="text-[11px] font-mono font-bold text-foreground tabular-nums">
                  {value >= 1000 ? `${(value / 1000).toFixed(2)}K` : value.toFixed(2)}
                </div>
                <div className={`text-[9px] font-mono tabular-nums ${positive ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
                  {positive ? '+' : ''}{changePct.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
