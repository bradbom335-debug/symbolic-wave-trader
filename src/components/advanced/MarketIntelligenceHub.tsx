import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface MarketMetric {
  label: string;
  value: string;
  change: number;
  changePercent: number;
}

const marketMetrics: MarketMetric[] = [
  { label: 'S&P', value: '4547', change: 23.45, changePercent: 0.52 },
  { label: 'NDX', value: '14231', change: -12.34, changePercent: -0.09 },
  { label: 'DOW', value: '34875', change: 156.78, changePercent: 0.45 },
  { label: 'VIX', value: '18.45', change: -2.13, changePercent: -10.35 },
  { label: 'EUR', value: '1.088', change: 0.0023, changePercent: 0.21 },
  { label: 'GOLD', value: '2034', change: 12.30, changePercent: 0.61 },
  { label: 'OIL', value: '78.45', change: -1.23, changePercent: -1.54 },
  { label: 'BTC', value: '43.2K', change: 1234.56, changePercent: 2.94 }
];

export const MarketIntelligenceHub = () => {
  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">Market Intelligence</h3>
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3 text-[hsl(var(--terminal-blue))]" />
          <span className="text-[9px] font-mono text-[hsl(var(--terminal-blue))]">LIVE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="grid grid-cols-4 gap-1">
          {marketMetrics.map((metric) => (
            <div key={metric.label} className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1 rounded">
              <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-0.5">{metric.label}</div>
              <div className="text-[11px] font-mono font-bold text-foreground">{metric.value}</div>
              <div className={`text-[9px] font-mono ${metric.change >= 0 ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
                {metric.change >= 0 ? '+' : ''}{metric.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};