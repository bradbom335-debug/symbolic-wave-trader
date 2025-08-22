import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Waves, Zap } from 'lucide-react';

interface WaveformData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  resonance: number;
  entropy: number;
  fieldEquation: string;
}

const mockData: WaveformData[] = [
  {
    symbol: 'AAPL',
    price: 175.43,
    change: 2.87,
    changePercent: 1.67,
    resonance: 0.73,
    entropy: 1.24,
    fieldEquation: 'ψ(AAPL) = e^(1.24) * sin(ωt + φ)'
  },
  {
    symbol: 'TSLA',
    price: 248.91,
    change: -5.22,
    changePercent: -2.06,
    resonance: 0.45,
    entropy: 2.81,
    fieldEquation: 'ψ(TSLA) = e^(2.81) * cos(ωt - π/4)'
  },
  {
    symbol: 'NVDA',
    price: 421.37,
    change: 12.44,
    changePercent: 3.04,
    resonance: 0.89,
    entropy: 0.94,
    fieldEquation: 'ψ(NVDA) = e^(0.94) * exp(iωt)'
  }
];

export const SymbolicChart = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Symbolic Asset Field</h2>
          <p className="text-sm text-muted-foreground">Real-time quantum oscillation analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-primary animate-wave-flow" />
          <span className="text-sm font-medium text-primary">Wave Sync Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockData.map((asset) => (
          <div 
            key={asset.symbol}
            className="group relative p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-resonance"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-foreground">{asset.symbol}</div>
                  <div className={`flex items-center space-x-1 ${
                    asset.change >= 0 ? 'text-resonance' : 'text-chaos'
                  }`}>
                    {asset.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-foreground">
                  ${asset.price.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  asset.change >= 0 ? 'text-resonance' : 'text-chaos'
                }`}>
                  {asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Resonance</div>
                <div className="text-lg font-mono font-bold text-resonance">
                  {asset.resonance.toFixed(2)}
                </div>
                <div className={`h-2 bg-secondary rounded-full mt-2 overflow-hidden`}>
                  <div 
                    className="h-full bg-resonance transition-all duration-500"
                    style={{ width: `${asset.resonance * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Entropy</div>
                <div className="text-lg font-mono font-bold text-entropy">
                  {asset.entropy.toFixed(2)}
                </div>
                <div className="flex items-center justify-center mt-2">
                  <Zap className={`h-4 w-4 ${
                    asset.entropy > 2 ? 'text-chaos animate-pulse' : 'text-entropy'
                  }`} />
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Temporal Phase</div>
                <div className="text-sm font-mono text-temporal mt-1">
                  {Math.sin(Date.now() / 10000 + Math.random() * Math.PI).toFixed(3)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Symbolic Field Equation:</div>
              <div className="font-mono text-sm text-primary bg-secondary/50 px-3 py-2 rounded border border-border/30">
                {asset.fieldEquation}
              </div>
            </div>

            {/* Neural Glow Effect */}
            <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
          </div>
        ))}
      </div>
    </Card>
  );
};