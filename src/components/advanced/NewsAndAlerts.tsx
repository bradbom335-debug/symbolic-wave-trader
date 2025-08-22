import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, TrendingUp, TrendingDown, AlertTriangle, ExternalLink, 
  Clock, Globe, Brain, Zap, MessageCircle, Heart, Share2
} from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relevantSymbols: string[];
  url: string;
  neuralScore: number;
  socialBuzz: number;
}

interface MarketAlert {
  id: string;
  type: 'breakout' | 'earnings' | 'volume' | 'technical' | 'news';
  symbol: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  data?: any;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    headline: 'Apple Reports Record Q4 Revenue Driven by Services Growth',
    summary: 'Apple Inc. reported quarterly revenue of $94.9 billion, beating analyst estimates of $94.5 billion. Services revenue grew 16% year-over-year to $22.3 billion.',
    source: 'Financial Times',
    timestamp: '2 hours ago',
    sentiment: 'bullish',
    impact: 'high',
    relevantSymbols: ['AAPL'],
    url: '#',
    neuralScore: 0.87,
    socialBuzz: 8.4
  },
  {
    id: '2',
    headline: 'NVIDIA Announces Next-Generation AI Chips for Data Centers',
    summary: 'NVIDIA unveiled its latest H200 Tensor Core GPUs, featuring 141GB of HBM3e memory and up to 4.8TB/s of memory bandwidth for enhanced AI training capabilities.',
    source: 'TechCrunch',
    timestamp: '4 hours ago',
    sentiment: 'bullish',
    impact: 'high',
    relevantSymbols: ['NVDA'],
    url: '#',
    neuralScore: 0.92,
    socialBuzz: 9.2
  },
  {
    id: '3',
    headline: 'Federal Reserve Signals Potential Rate Pause Amid Inflation Concerns',
    summary: 'Fed Chair Powell indicated the central bank may pause interest rate hikes as recent inflation data shows signs of stabilization around the 2% target.',
    source: 'Reuters',
    timestamp: '6 hours ago',
    sentiment: 'neutral',
    impact: 'high',
    relevantSymbols: ['SPY', 'QQQ'],
    url: '#',
    neuralScore: 0.65,
    socialBuzz: 7.8
  },
  {
    id: '4',
    headline: 'Tesla Cybertruck Production Faces Delays Due to Battery Constraints',
    summary: 'Sources close to Tesla suggest Cybertruck deliveries may be pushed to Q2 2024 due to challenges in scaling 4680 battery cell production.',
    source: 'Bloomberg',
    timestamp: '8 hours ago',
    sentiment: 'bearish',
    impact: 'medium',
    relevantSymbols: ['TSLA'],
    url: '#',
    neuralScore: 0.34,
    socialBuzz: 6.1
  },
  {
    id: '5',
    headline: 'Microsoft Azure Revenue Grows 29% as Cloud Demand Accelerates',
    summary: 'Microsoft reported strong cloud growth with Azure revenue increasing 29% year-over-year, driven by enterprise AI adoption and hybrid cloud solutions.',
    source: 'CNBC',
    timestamp: '12 hours ago',
    sentiment: 'bullish',
    impact: 'medium',
    relevantSymbols: ['MSFT'],
    url: '#',
    neuralScore: 0.78,
    socialBuzz: 7.3
  }
];

const mockAlerts: MarketAlert[] = [
  {
    id: '1',
    type: 'breakout',
    symbol: 'AAPL',
    message: 'Price broke above 20-day moving average resistance at $175.50',
    priority: 'high',
    timestamp: '15 minutes ago',
    data: { price: 175.63, resistance: 175.50 }
  },
  {
    id: '2',
    type: 'volume',
    symbol: 'NVDA',
    message: 'Unusual volume spike detected - 300% above average',
    priority: 'critical',
    timestamp: '23 minutes ago',
    data: { volume: '45.2M', average: '15.1M' }
  },
  {
    id: '3',
    type: 'earnings',
    symbol: 'TSLA',
    message: 'Earnings call scheduled for today at 5:30 PM EST',
    priority: 'medium',
    timestamp: '1 hour ago',
    data: { time: '5:30 PM EST' }
  },
  {
    id: '4',
    type: 'technical',
    symbol: 'MSFT',
    message: 'RSI oversold condition at 28.4 - potential reversal signal',
    priority: 'medium',
    timestamp: '1 hour ago',
    data: { rsi: 28.4, threshold: 30 }
  }
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'bullish': return 'text-resonance bg-resonance/10';
    case 'bearish': return 'text-chaos bg-chaos/10';
    case 'neutral': return 'text-temporal bg-temporal/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'high': return <AlertTriangle className="h-4 w-4" />;
    case 'medium': return <TrendingUp className="h-4 w-4" />;
    case 'low': return <MessageCircle className="h-4 w-4" />;
    default: return null;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'border-l-chaos bg-chaos/5';
    case 'high': return 'border-l-entropy bg-entropy/5';
    case 'medium': return 'border-l-temporal bg-temporal/5';
    case 'low': return 'border-l-resonance bg-resonance/5';
    default: return 'border-l-muted-foreground bg-muted';
  }
};

export const NewsAndAlerts = () => {
  return (
    <div className="space-y-6">
      {/* Market News Feed */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Neural News Intelligence</h2>
            <p className="text-sm text-muted-foreground">AI-powered market news analysis & sentiment tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Neural Analysis Active</span>
          </div>
        </div>

        <div className="space-y-4">
          {mockNews.map((news) => (
            <div 
              key={news.id}
              className="group relative p-5 bg-secondary/20 rounded-lg border border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-resonance"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getSentimentColor(news.sentiment)}>
                    {news.sentiment.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    {getImpactIcon(news.impact)}
                    <span className="text-xs uppercase tracking-wide">{news.impact} Impact</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{news.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>{news.source}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {news.headline}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {news.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-wrap gap-1">
                    {news.relevantSymbols.map((symbol) => (
                      <Badge key={symbol} variant="outline" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Brain className="h-3 w-3 text-primary" />
                      <span className="font-mono text-primary">{news.neuralScore.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3 text-temporal" />
                      <span className="font-mono text-temporal">{news.socialBuzz.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Neural Glow Effect */}
              <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-resonance rounded" />
                <span className="text-muted-foreground">Bullish Sentiment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chaos rounded" />
                <span className="text-muted-foreground">Bearish Sentiment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-temporal rounded" />
                <span className="text-muted-foreground">Neutral Sentiment</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Newspaper className="h-4 w-4 mr-2" />
              View All News
            </Button>
          </div>
        </div>
      </Card>

      {/* Real-Time Alerts */}
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Real-Time Market Alerts</h3>
            <p className="text-sm text-muted-foreground">Instant notifications for critical market events</p>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-entropy animate-pulse" />
            <span className="text-sm font-medium text-entropy">Live Monitoring</span>
          </div>
        </div>

        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)} transition-all duration-300 hover:shadow-resonance`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs font-mono">
                    {alert.symbol}
                  </Badge>
                  <Badge className={`text-xs ${
                    alert.priority === 'critical' ? 'bg-chaos/20 text-chaos' :
                    alert.priority === 'high' ? 'bg-entropy/20 text-entropy' :
                    alert.priority === 'medium' ? 'bg-temporal/20 text-temporal' :
                    'bg-resonance/20 text-resonance'
                  }`}>
                    {alert.priority.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {alert.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <p className="text-sm text-foreground mb-2">
                {alert.message}
              </p>

              {alert.data && (
                <div className="text-xs text-muted-foreground">
                  {Object.entries(alert.data).map(([key, value]) => (
                    <span key={key} className="mr-4">
                      <span className="capitalize">{key}:</span> <span className="font-mono">{String(value)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Alert Types:</span>
              <div className="flex items-center space-x-4">
                <span className="text-chaos">● Critical</span>
                <span className="text-entropy">● High</span>
                <span className="text-temporal">● Medium</span>
                <span className="text-resonance">● Low</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              <span className="font-mono text-primary">24</span> alerts today
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};