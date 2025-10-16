import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface OptionsFlowEntry {
  id: string;
  symbol: string;
  strike: number;
  expiry: string;
  optionType: 'call' | 'put';
  tradeType: 'sweep' | 'block' | 'split' | 'normal';
  premium: number;
  size: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  isUnusual: boolean;
}

export function OptionsFlowPanel() {
  const [flows, setFlows] = useState<OptionsFlowEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockFlows: OptionsFlowEntry[] = Array.from({ length: 20 }, (_, i) => ({
      id: `flow-${i}`,
      symbol: ['AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ'][Math.floor(Math.random() * 5)],
      strike: Math.floor(Math.random() * 100) + 100,
      expiry: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      optionType: Math.random() > 0.5 ? 'call' : 'put',
      tradeType: ['sweep', 'block', 'split', 'normal'][Math.floor(Math.random() * 4)] as any,
      premium: Math.random() * 500000 + 10000,
      size: Math.floor(Math.random() * 1000) + 100,
      sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      isUnusual: Math.random() > 0.7,
    }));

    setTimeout(() => {
      setFlows(mockFlows);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-terminal-blue" />
      </div>
    );
  }

  return (
    <Card className="h-full bg-terminal-bg-panel border-terminal-bg-elevated overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-3 py-2 border-b border-terminal-bg-elevated bg-terminal-bg-deep">
          <h3 className="text-sm font-semibold text-text-terminal-primary">Options Flow Scanner</h3>
          <p className="text-xs text-text-terminal-muted mt-0.5">Unusual options activity</p>
        </div>

        {/* Flow List */}
        <div className="flex-1 overflow-auto">
          <div className="divide-y divide-terminal-bg-elevated">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className={`px-3 py-2 hover:bg-terminal-bg-elevated/50 transition-colors ${
                  flow.isUnusual ? 'bg-terminal-purple/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-terminal-primary font-mono">
                        {flow.symbol}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          flow.optionType === 'call' ? 'border-terminal-green text-terminal-green' : 'border-terminal-red text-terminal-red'
                        }`}
                      >
                        {flow.optionType.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-text-terminal-muted font-mono">
                        ${flow.strike} {flow.expiry}
                      </span>
                      {flow.isUnusual && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 border-terminal-purple text-terminal-purple">
                          UNUSUAL
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-text-terminal-muted">
                        Type: <span className="text-terminal-blue font-mono">{flow.tradeType.toUpperCase()}</span>
                      </span>
                      <span className="text-text-terminal-muted">
                        Size: <span className="text-text-terminal-primary font-mono">{flow.size}</span>
                      </span>
                      <span className="text-text-terminal-muted">
                        Premium: <span className="text-terminal-gold font-mono">${(flow.premium / 1000).toFixed(1)}K</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1 text-xs ${
                      flow.sentiment === 'bullish' ? 'text-terminal-green' : 
                      flow.sentiment === 'bearish' ? 'text-terminal-red' : 'text-terminal-blue'
                    }`}>
                      {flow.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3" /> : 
                       flow.sentiment === 'bearish' ? <TrendingDown className="w-3 h-3" /> : null}
                      <span className="font-semibold uppercase">{flow.sentiment}</span>
                    </div>
                    <span className="text-xs text-text-terminal-muted">
                      {flow.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
