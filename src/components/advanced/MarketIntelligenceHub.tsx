import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, 
  BarChart3, PieChart, Activity, Globe, Calendar, Clock
} from 'lucide-react';

interface MarketMetric {
  label: string;
  value: string;
  change: number;
  changePercent: number;
  significance: 'high' | 'medium' | 'low';
}

interface EconomicEvent {
  time: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
}

interface SectorData {
  name: string;
  performance: number;
  volume: number;
  marketCap: number;
  trending: 'up' | 'down' | 'neutral';
}

const marketMetrics: MarketMetric[] = [
  { label: 'S&P 500', value: '4,547.12', change: 23.45, changePercent: 0.52, significance: 'high' },
  { label: 'NASDAQ', value: '14,231.89', change: -12.34, changePercent: -0.09, significance: 'medium' },
  { label: 'DOW JONES', value: '34,875.23', change: 156.78, changePercent: 0.45, significance: 'high' },
  { label: 'VIX', value: '18.45', change: -2.13, changePercent: -10.35, significance: 'high' },
  { label: 'USD/EUR', value: '1.0875', change: 0.0023, changePercent: 0.21, significance: 'medium' },
  { label: 'GOLD', value: '$2,034.50', change: 12.30, changePercent: 0.61, significance: 'medium' },
  { label: 'OIL (WTI)', value: '$78.45', change: -1.23, changePercent: -1.54, significance: 'low' },
  { label: 'BTC/USD', value: '$43,234.67', change: 1234.56, changePercent: 2.94, significance: 'high' }
];

const economicEvents: EconomicEvent[] = [
  {
    time: '09:30',
    event: 'Non-Farm Payrolls',
    impact: 'high',
    forecast: '185K',
    previous: '199K',
    actual: '187K'
  },
  {
    time: '10:00',
    event: 'Unemployment Rate',
    impact: 'high',
    forecast: '3.7%',
    previous: '3.7%'
  },
  {
    time: '14:00',
    event: 'Fed Chair Powell Speech',
    impact: 'high',
    forecast: 'Hawkish',
    previous: 'Neutral'
  },
  {
    time: '15:30',
    event: 'EIA Crude Oil Inventories',
    impact: 'medium',
    forecast: '-2.1M',
    previous: '-1.8M'
  }
];

const sectorData: SectorData[] = [
  { name: 'Technology', performance: 2.34, volume: 12.5, marketCap: 8.9, trending: 'up' },
  { name: 'Healthcare', performance: 1.12, volume: 6.8, marketCap: 6.2, trending: 'up' },
  { name: 'Financials', performance: -0.89, volume: 8.9, marketCap: 5.1, trending: 'down' },
  { name: 'Energy', performance: 3.45, volume: 4.2, marketCap: 1.8, trending: 'up' },
  { name: 'Consumer Disc.', performance: -1.23, volume: 5.6, marketCap: 4.3, trending: 'down' },
  { name: 'Industrials', performance: 0.67, volume: 3.4, marketCap: 3.9, trending: 'neutral' }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'text-chaos bg-chaos/10';
    case 'medium': return 'text-temporal bg-temporal/10';
    case 'low': return 'text-resonance bg-resonance/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getSignificanceIcon = (significance: string) => {
  switch (significance) {
    case 'high': return <AlertTriangle className="h-4 w-4 text-chaos" />;
    case 'medium': return <Activity className="h-4 w-4 text-temporal" />;
    case 'low': return <BarChart3 className="h-4 w-4 text-resonance" />;
    default: return null;
  }
};

export const MarketIntelligenceHub = () => {
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Global Market Intelligence</h2>
            <p className="text-sm text-muted-foreground">Real-time market data & neural analysis</p>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Live Feed</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {marketMetrics.map((metric, index) => (
            <div 
              key={index}
              className="group p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-resonance"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                {getSignificanceIcon(metric.significance)}
              </div>
              
              <div className="text-xl font-mono font-bold text-foreground mb-1">
                {metric.value}
              </div>
              
              <div className={`flex items-center space-x-1 text-sm ${
                metric.change >= 0 ? 'text-resonance' : 'text-chaos'
              }`}>
                {metric.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{metric.change >= 0 ? '+' : ''}{metric.change}</span>
                <span>({metric.changePercent >= 0 ? '+' : ''}{metric.changePercent}%)</span>
              </div>

              {/* Neural Glow Effect */}
              <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
            </div>
          ))}
        </div>
      </Card>

      {/* Economic Calendar & Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Economic Calendar */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Economic Calendar</h3>
              <p className="text-sm text-muted-foreground">Today's high-impact events</p>
            </div>
            <Calendar className="h-5 w-5 text-temporal" />
          </div>

          <div className="space-y-4">
            {economicEvents.map((event, index) => (
              <div 
                key={index}
                className="group p-3 bg-secondary/20 rounded-lg border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono text-foreground">{event.time}</span>
                    </div>
                    <Badge className={getImpactColor(event.impact)}>
                      {event.impact.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <h4 className="font-semibold text-foreground mb-2">{event.event}</h4>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Forecast:</span>
                    <div className="font-mono text-temporal">{event.forecast}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Previous:</span>
                    <div className="font-mono text-foreground">{event.previous}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual:</span>
                    <div className={`font-mono ${event.actual ? 'text-resonance' : 'text-muted-foreground'}`}>
                      {event.actual || 'TBD'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sector Performance */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Sector Performance</h3>
              <p className="text-sm text-muted-foreground">S&P 500 sector breakdown</p>
            </div>
            <PieChart className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-3">
            {sectorData.map((sector, index) => (
              <div 
                key={index}
                className="group p-3 bg-secondary/20 rounded-lg border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{sector.name}</span>
                    {sector.trending === 'up' && <TrendingUp className="h-4 w-4 text-resonance" />}
                    {sector.trending === 'down' && <TrendingDown className="h-4 w-4 text-chaos" />}
                    {sector.trending === 'neutral' && <Activity className="h-4 w-4 text-temporal" />}
                  </div>
                  <div className={`text-lg font-mono font-bold ${
                    sector.performance >= 0 ? 'text-resonance' : 'text-chaos'
                  }`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Volume:</span>
                    <div className="font-mono text-temporal">{sector.volume.toFixed(1)}B</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Cap:</span>
                    <div className="font-mono text-foreground">${sector.marketCap.toFixed(1)}T</div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-2">
                  <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        sector.performance >= 0 ? 'bg-resonance' : 'bg-chaos'
                      }`}
                      style={{ width: `${Math.min(Math.abs(sector.performance) * 20, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Market Sentiment & Risk Analysis */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <h3 className="text-lg font-bold text-foreground mb-6">Neural Market Sentiment & Risk Matrix</h3>
        
        <div className="grid grid-cols-6 gap-4">
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Fear & Greed</div>
            <div className="text-2xl font-mono font-bold text-temporal">67</div>
            <div className="text-xs text-temporal">Greed</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Put/Call Ratio</div>
            <div className="text-2xl font-mono font-bold text-resonance">0.85</div>
            <div className="text-xs text-resonance">Bullish</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">AAII Bull%</div>
            <div className="text-2xl font-mono font-bold text-resonance">52.3%</div>
            <div className="text-xs text-resonance">Above Avg</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Term Structure</div>
            <div className="text-2xl font-mono font-bold text-entropy">-23bps</div>
            <div className="text-xs text-entropy">Inverted</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Credit Spread</div>
            <div className="text-2xl font-mono font-bold text-temporal">145bps</div>
            <div className="text-xs text-temporal">Normal</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Skew Index</div>
            <div className="text-2xl font-mono font-bold text-chaos">134.5</div>
            <div className="text-xs text-chaos">Elevated</div>
          </div>
        </div>
      </Card>
    </div>
  );
};