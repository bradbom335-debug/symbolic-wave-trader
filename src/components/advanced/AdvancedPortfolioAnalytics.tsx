import { Card } from '@/components/ui/card';

interface HoldingDetail {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  allocation: number;
}

const holdings: HoldingDetail[] = [
  { symbol: 'AAPL', value: 26314, change: 431, changePercent: 1.67, allocation: 35.2 },
  { symbol: 'NVDA', value: 33668, change: 934, changePercent: 2.85, allocation: 28.7 },
  { symbol: 'MSFT', value: 32845, change: 287, changePercent: 0.88, allocation: 18.4 },
  { symbol: 'TSLA', value: 11946, change: -305, changePercent: -2.49, allocation: 17.7 }
];

export const AdvancedPortfolioAnalytics = () => {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalChange = holdings.reduce((sum, h) => sum + h.change, 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">Portfolio</h3>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))]">VAL </span>
            <span className="text-[11px] font-mono font-bold text-foreground">${(totalValue / 1000).toFixed(1)}K</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))]">P/L </span>
            <span className={`text-[11px] font-mono font-bold ${totalChange >= 0 ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
              {totalChange >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="space-y-1">
          {holdings.map((holding) => (
            <div key={holding.symbol} className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1 rounded flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[10px] font-mono font-bold text-foreground min-w-[40px]">{holding.symbol}</span>
                <div className="flex-1 h-1 bg-[hsl(var(--terminal-bg))] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[hsl(var(--terminal-blue))]" 
                    style={{ width: `${holding.allocation}%` }}
                  />
                </div>
              </div>
              <div className="text-right ml-2">
                <div className="text-[10px] font-mono font-bold text-foreground">${(holding.value / 1000).toFixed(1)}K</div>
                <div className={`text-[8px] font-mono ${holding.changePercent >= 0 ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
                  {holding.changePercent >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};