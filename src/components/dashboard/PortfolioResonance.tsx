import { Card } from '@/components/ui/card';
import { Waves, PieChart, TrendingUp, Zap } from 'lucide-react';

interface PortfolioHolding {
  symbol: string;
  allocation: number;
  value: number;
  resonanceLevel: number;
  harmonicPhase: number;
  neuralWeight: number;
}

const mockHoldings: PortfolioHolding[] = [
  {
    symbol: 'AAPL',
    allocation: 35.2,
    value: 52840.75,
    resonanceLevel: 0.73,
    harmonicPhase: 1.24,
    neuralWeight: 0.89
  },
  {
    symbol: 'NVDA',
    allocation: 28.7,
    value: 43105.22,
    resonanceLevel: 0.89,
    harmonicPhase: 2.11,
    neuralWeight: 0.94
  },
  {
    symbol: 'TSLA',
    allocation: 18.4,
    value: 27630.18,
    resonanceLevel: 0.45,
    harmonicPhase: -0.67,
    neuralWeight: 0.61
  },
  {
    symbol: 'MSFT',
    allocation: 17.7,
    value: 26587.43,
    resonanceLevel: 0.81,
    harmonicPhase: 0.93,
    neuralWeight: 0.85
  }
];

const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.value, 0);

export const PortfolioResonance = () => {
  const overallResonance = mockHoldings.reduce((sum, holding) => 
    sum + (holding.resonanceLevel * holding.allocation / 100), 0
  );

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Portfolio Resonance Matrix</h2>
          <p className="text-sm text-muted-foreground">Harmonic balance & neural weights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-resonance animate-wave-flow" />
          <span className="text-sm font-medium text-resonance">Synchronized</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
          <div className="text-sm text-muted-foreground mb-1">Total Value</div>
          <div className="text-3xl font-mono font-bold text-foreground">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-resonance mt-1">+12.4% (24h)</div>
        </div>

        <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
          <div className="text-sm text-muted-foreground mb-1">Field Resonance</div>
          <div className="text-3xl font-mono font-bold text-resonance">
            {overallResonance.toFixed(2)}
          </div>
          <div className="flex items-center justify-center mt-2">
            <div className="w-16 bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-resonance transition-all duration-1000"
                style={{ width: `${overallResonance * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockHoldings.map((holding, index) => (
          <div 
            key={holding.symbol}
            className="group relative p-4 bg-secondary/20 rounded-lg border border-border/20 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-foreground">{holding.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {holding.allocation.toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-foreground">
                  ${holding.value.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Resonance</div>
                <div className="text-lg font-mono font-bold text-resonance">
                  {holding.resonanceLevel.toFixed(2)}
                </div>
                <div className="w-full bg-secondary rounded-full h-1 mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-resonance transition-all duration-500"
                    style={{ width: `${holding.resonanceLevel * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Phase</div>
                <div className="text-lg font-mono font-bold text-temporal">
                  {holding.harmonicPhase.toFixed(2)}
                </div>
                <div className="flex items-center justify-center mt-1">
                  <Zap className={`h-3 w-3 ${
                    Math.abs(holding.harmonicPhase) > 1.5 ? 'text-chaos' : 'text-temporal'
                  }`} />
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Neural Wt</div>
                <div className="text-lg font-mono font-bold text-primary">
                  {holding.neuralWeight.toFixed(2)}
                </div>
                <div className="w-full bg-secondary rounded-full h-1 mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${holding.neuralWeight * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Allocation Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Portfolio Weight</span>
                <span>{holding.allocation.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-neural transition-all duration-1000"
                  style={{ width: `${holding.allocation}%` }}
                />
              </div>
            </div>

            {/* Neural Glow Effect */}
            <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-muted-foreground">Risk Entropy</div>
            <div className="font-mono text-entropy font-bold">1.24σ</div>
          </div>
          <div>
            <div className="text-muted-foreground">Sharpe Resonance</div>
            <div className="font-mono text-resonance font-bold">2.87</div>
          </div>
          <div>
            <div className="text-muted-foreground">Beta Harmonics</div>
            <div className="font-mono text-temporal font-bold">0.94</div>
          </div>
        </div>
      </div>
    </Card>
  );
};