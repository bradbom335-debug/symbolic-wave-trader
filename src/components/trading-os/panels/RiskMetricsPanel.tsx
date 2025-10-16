import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface RiskMetrics {
  portfolioValue: number;
  var95: number;
  cvar95: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  betaVsSpy: number;
  volatility: number;
}

export function RiskMetricsPanel() {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock risk metrics
    const mockMetrics: RiskMetrics = {
      portfolioValue: 250000 + Math.random() * 50000,
      var95: -(Math.random() * 15000 + 5000),
      cvar95: -(Math.random() * 20000 + 10000),
      sharpeRatio: Math.random() * 2 + 0.5,
      sortinoRatio: Math.random() * 2.5 + 0.8,
      maxDrawdown: -(Math.random() * 0.15 + 0.05),
      betaVsSpy: Math.random() * 0.8 + 0.6,
      volatility: Math.random() * 0.3 + 0.15,
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
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

  if (!metrics) return null;

  const MetricCard = ({ 
    label, 
    value, 
    suffix = '', 
    isPercentage = false,
    isCurrency = false,
    sentiment = 'neutral' 
  }: { 
    label: string; 
    value: number; 
    suffix?: string;
    isPercentage?: boolean;
    isCurrency?: boolean;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }) => {
    const displayValue = isCurrency 
      ? `$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : isPercentage
      ? `${(value * 100).toFixed(2)}%`
      : value.toFixed(2);

    const colorClass = sentiment === 'positive' 
      ? 'text-terminal-green' 
      : sentiment === 'negative' 
      ? 'text-terminal-red' 
      : 'text-terminal-blue';

    return (
      <div className="bg-terminal-bg-elevated rounded-lg p-3 border border-terminal-bg-elevated/50">
        <div className="text-xs text-text-terminal-muted mb-1">{label}</div>
        <div className={`text-xl font-mono font-bold ${colorClass} flex items-baseline gap-1`}>
          {value < 0 && '-'}
          {displayValue}
          {suffix && <span className="text-xs text-text-terminal-muted ml-1">{suffix}</span>}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full bg-terminal-bg-panel border-terminal-bg-elevated overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-3 py-2 border-b border-terminal-bg-elevated bg-terminal-bg-deep">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-terminal-primary">Portfolio Risk Metrics</h3>
              <p className="text-xs text-text-terminal-muted mt-0.5">Real-time risk analysis</p>
            </div>
            <Activity className="w-4 h-4 text-terminal-purple" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 overflow-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard 
              label="Portfolio Value" 
              value={metrics.portfolioValue} 
              isCurrency 
              sentiment="neutral"
            />
            <MetricCard 
              label="Value at Risk (95%)" 
              value={metrics.var95} 
              isCurrency 
              sentiment="negative"
            />
            <MetricCard 
              label="Conditional VaR (95%)" 
              value={metrics.cvar95} 
              isCurrency 
              sentiment="negative"
            />
            <MetricCard 
              label="Sharpe Ratio" 
              value={metrics.sharpeRatio} 
              sentiment={metrics.sharpeRatio > 1 ? 'positive' : 'neutral'}
            />
            <MetricCard 
              label="Sortino Ratio" 
              value={metrics.sortinoRatio} 
              sentiment={metrics.sortinoRatio > 1 ? 'positive' : 'neutral'}
            />
            <MetricCard 
              label="Max Drawdown" 
              value={metrics.maxDrawdown} 
              isPercentage 
              sentiment="negative"
            />
            <MetricCard 
              label="Beta vs SPY" 
              value={metrics.betaVsSpy} 
              sentiment={metrics.betaVsSpy < 1 ? 'positive' : 'neutral'}
            />
            <MetricCard 
              label="Volatility (Annual)" 
              value={metrics.volatility} 
              isPercentage 
              sentiment={metrics.volatility < 0.25 ? 'positive' : 'negative'}
            />
          </div>

          {/* Risk Level Indicator */}
          <div className="mt-4 p-3 bg-terminal-bg-elevated rounded-lg border border-terminal-bg-elevated/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-terminal-muted">Overall Risk Level</span>
              <span className="text-sm font-bold text-terminal-orange">MODERATE</span>
            </div>
            <div className="w-full bg-terminal-bg-deep rounded-full h-2">
              <div className="bg-terminal-orange h-2 rounded-full" style={{ width: '55%' }} />
            </div>
            <div className="flex justify-between mt-1 text-xs text-text-terminal-muted">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
