import { Activity, Brain, Zap, TrendingUp } from 'lucide-react';

export const MarketHeader = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary animate-neural-pulse" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-resonance rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-neural bg-clip-text text-transparent">
                MarketForge AI
              </h1>
              <p className="text-sm text-muted-foreground">Symbolic Financial Cognition Engine</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border/50">
              <Activity className="h-4 w-4 text-resonance" />
              <span className="text-sm font-medium">Neural Sync</span>
              <div className="w-2 h-2 bg-resonance rounded-full animate-pulse" />
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border/50">
              <Zap className="h-4 w-4 text-temporal" />
              <span className="text-sm font-medium">Quantum Active</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border/50">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Market Phase: Resonance</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Temporal Index</div>
            <div className="text-lg font-mono font-bold text-temporal">
              Ψ(t) = 847.29
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};