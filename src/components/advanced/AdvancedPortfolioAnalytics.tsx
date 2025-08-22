import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, Activity, 
  Target, Shield, AlertTriangle, Clock, Zap
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Pie } from 'recharts';

interface HoldingDetail {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  dayChange: number;
  totalReturn: number;
  totalReturnPercent: number;
  allocation: number;
  beta: number;
  pe: number;
  dividend: number;
  marketCap: string;
  sector: string;
  riskScore: number;
  neuralRating: number;
  quantumSignal: number;
}

interface RiskMetric {
  metric: string;
  value: number;
  benchmark: number;
  rating: 'low' | 'medium' | 'high';
  description: string;
}

const holdings: HoldingDetail[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 150,
    avgCost: 165.50,
    currentPrice: 175.43,
    value: 26314.50,
    dayChange: 431.10,
    totalReturn: 1489.50,
    totalReturnPercent: 5.99,
    allocation: 35.2,
    beta: 1.24,
    pe: 28.5,
    dividend: 0.96,
    marketCap: '2.8T',
    sector: 'Technology',
    riskScore: 3.2,
    neuralRating: 0.87,
    quantumSignal: 0.73
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 75,
    avgCost: 420.00,
    currentPrice: 448.91,
    value: 33668.25,
    dayChange: 933.75,
    totalReturn: 2168.25,
    totalReturnPercent: 6.89,
    allocation: 28.7,
    beta: 1.67,
    pe: 45.2,
    dividend: 0.16,
    marketCap: '1.1T',
    sector: 'Technology',
    riskScore: 4.1,
    neuralRating: 0.94,
    quantumSignal: 0.89
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 100,
    avgCost: 315.75,
    currentPrice: 328.45,
    value: 32845.00,
    dayChange: 287.00,
    totalReturn: 1270.00,
    totalReturnPercent: 4.02,
    allocation: 18.4,
    beta: 0.89,
    pe: 24.8,
    dividend: 2.72,
    marketCap: '2.4T',
    sector: 'Technology',
    riskScore: 2.8,
    neuralRating: 0.85,
    quantumSignal: 0.68
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 50,
    avgCost: 245.00,
    currentPrice: 238.91,
    value: 11945.50,
    dayChange: -304.50,
    totalReturn: -304.50,
    totalReturnPercent: -2.49,
    allocation: 17.7,
    beta: 2.11,
    pe: 52.1,
    dividend: 0.00,
    marketCap: '750B',
    sector: 'Consumer Cyclical',
    riskScore: 5.2,
    neuralRating: 0.61,
    quantumSignal: 0.45
  }
];

const riskMetrics: RiskMetric[] = [
  {
    metric: 'Portfolio Beta',
    value: 1.32,
    benchmark: 1.00,
    rating: 'medium',
    description: 'Higher volatility than market'
  },
  {
    metric: 'Sharpe Ratio',
    value: 1.87,
    benchmark: 1.50,
    rating: 'low',
    description: 'Excellent risk-adjusted returns'
  },
  {
    metric: 'Max Drawdown',
    value: -12.4,
    benchmark: -15.0,
    rating: 'low',
    description: 'Better than benchmark'
  },
  {
    metric: 'VaR (95%)',
    value: -3.2,
    benchmark: -5.0,
    rating: 'low',
    description: 'Daily loss potential'
  },
  {
    metric: 'Correlation to SPY',
    value: 0.78,
    benchmark: 0.85,
    rating: 'medium',
    description: 'Moderate diversification'
  },
  {
    metric: 'Information Ratio',
    value: 0.94,
    benchmark: 0.50,
    rating: 'low',
    description: 'Strong alpha generation'
  }
];

const allocationData = holdings.map(h => ({
  name: h.symbol,
  value: h.allocation,
  color: h.symbol === 'AAPL' ? 'hsl(var(--primary))' : 
         h.symbol === 'NVDA' ? 'hsl(var(--resonance))' : 
         h.symbol === 'MSFT' ? 'hsl(var(--temporal))' : 'hsl(var(--entropy))'
}));

const performanceData = holdings.map(h => ({
  symbol: h.symbol,
  return: h.totalReturnPercent,
  neural: h.neuralRating * 100,
  quantum: h.quantumSignal * 100
}));

const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
const totalReturn = holdings.reduce((sum, h) => sum + h.totalReturn, 0);
const totalReturnPercent = (totalReturn / (totalValue - totalReturn)) * 100;
const dayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
const dayChangePercent = (dayChange / totalValue) * 100;

export const AdvancedPortfolioAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Advanced Portfolio Analytics</h2>
            <p className="text-sm text-muted-foreground">Comprehensive performance & risk analysis</p>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Neural Analysis Active</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Total Value</div>
            <div className="text-3xl font-mono font-bold text-foreground">
              ${totalValue.toLocaleString()}
            </div>
            <div className={`text-sm font-medium mt-1 ${dayChange >= 0 ? 'text-resonance' : 'text-chaos'}`}>
              {dayChange >= 0 ? '+' : ''}${dayChange.toFixed(2)} ({dayChangePercent >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%)
            </div>
          </div>

          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Total Return</div>
            <div className={`text-3xl font-mono font-bold ${totalReturn >= 0 ? 'text-resonance' : 'text-chaos'}`}>
              {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(0)}
            </div>
            <div className={`text-sm font-medium mt-1 ${totalReturn >= 0 ? 'text-resonance' : 'text-chaos'}`}>
              {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
            </div>
          </div>

          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Neural Score</div>
            <div className="text-3xl font-mono font-bold text-primary">
              {(holdings.reduce((sum, h) => sum + h.neuralRating * h.allocation, 0) / 100).toFixed(2)}
            </div>
            <div className="text-sm text-primary mt-1">Excellent</div>
          </div>

          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Risk Score</div>
            <div className="text-3xl font-mono font-bold text-entropy">
              {(holdings.reduce((sum, h) => sum + h.riskScore * h.allocation, 0) / 100).toFixed(1)}
            </div>
            <div className="text-sm text-entropy mt-1">Moderate</div>
          </div>
        </div>
      </Card>

      {/* Holdings Analysis & Allocation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Detailed Holdings */}
        <div className="xl:col-span-2">
          <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
            <h3 className="text-lg font-bold text-foreground mb-6">Detailed Holdings Analysis</h3>
            
            <div className="space-y-4">
              {holdings.map((holding, index) => (
                <div 
                  key={holding.symbol}
                  className="group relative p-5 bg-secondary/20 rounded-lg border border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-resonance"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-lg font-bold text-foreground">{holding.symbol}</div>
                        <div className="text-sm text-muted-foreground">{holding.name}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {holding.sector}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold text-foreground">
                        ${holding.currentPrice.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${
                        holding.dayChange >= 0 ? 'text-resonance' : 'text-chaos'
                      }`}>
                        {holding.dayChange >= 0 ? '+' : ''}${holding.dayChange.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Shares</div>
                      <div className="text-sm font-mono font-bold text-foreground">
                        {holding.shares}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg Cost</div>
                      <div className="text-sm font-mono font-bold text-foreground">
                        ${holding.avgCost.toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Value</div>
                      <div className="text-sm font-mono font-bold text-foreground">
                        ${holding.value.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Return</div>
                      <div className={`text-sm font-mono font-bold ${
                        holding.totalReturn >= 0 ? 'text-resonance' : 'text-chaos'
                      }`}>
                        {holding.totalReturn >= 0 ? '+' : ''}${holding.totalReturn.toFixed(0)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Beta</div>
                      <div className="text-sm font-mono font-bold text-temporal">
                        {holding.beta.toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">P/E</div>
                      <div className="text-sm font-mono font-bold text-foreground">
                        {holding.pe.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Neural Rating</div>
                      <div className="text-lg font-mono font-bold text-primary">
                        {holding.neuralRating.toFixed(2)}
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1 mt-1">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${holding.neuralRating * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Quantum Signal</div>
                      <div className="text-lg font-mono font-bold text-resonance">
                        {holding.quantumSignal.toFixed(2)}
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1 mt-1">
                        <div 
                          className="h-full bg-resonance transition-all duration-500"
                          style={{ width: `${holding.quantumSignal * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Risk Score</div>
                      <div className="text-lg font-mono font-bold text-entropy">
                        {holding.riskScore.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        {holding.riskScore > 4 ? (
                          <AlertTriangle className="h-4 w-4 text-chaos" />
                        ) : holding.riskScore > 3 ? (
                          <Shield className="h-4 w-4 text-entropy" />
                        ) : (
                          <Shield className="h-4 w-4 text-resonance" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Neural Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Allocation & Performance Charts */}
        <div className="space-y-6">
          {/* Allocation Pie Chart */}
          <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
            <h3 className="text-lg font-bold text-foreground mb-4">Portfolio Allocation</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-mono text-foreground">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Comparison */}
          <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
            <h3 className="text-lg font-bold text-foreground mb-4">AI Scoring Analysis</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="symbol" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="neural" fill="hsl(var(--primary))" name="Neural Score" />
                  <Bar dataKey="quantum" fill="hsl(var(--resonance))" name="Quantum Signal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Risk Analysis */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <h3 className="text-lg font-bold text-foreground mb-6">Advanced Risk Analysis</h3>
        
        <div className="grid grid-cols-3 gap-6">
          {riskMetrics.map((metric, index) => (
            <div 
              key={index}
              className="p-4 bg-secondary/30 rounded-lg border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{metric.metric}</span>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  metric.rating === 'low' ? 'bg-resonance/20 text-resonance' :
                  metric.rating === 'medium' ? 'bg-temporal/20 text-temporal' :
                  'bg-chaos/20 text-chaos'
                }`}>
                  {metric.rating.toUpperCase()}
                </div>
              </div>
              
              <div className="text-2xl font-mono font-bold text-foreground mb-1">
                {metric.value > 0 && metric.metric !== 'Max Drawdown' && metric.metric !== 'VaR (95%)' ? '+' : ''}{metric.value}
                {metric.metric.includes('Ratio') || metric.metric.includes('Correlation') ? '' : 
                 metric.metric.includes('%') || metric.metric.includes('Drawdown') || metric.metric.includes('VaR') ? '%' : 
                 metric.metric.includes('bps') ? 'bps' : ''}
              </div>
              
              <div className="text-xs text-muted-foreground mb-2">
                vs Benchmark: {metric.benchmark}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};