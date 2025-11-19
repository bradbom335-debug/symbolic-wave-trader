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
    <Card className="h-full flex flex-col p-2 bg-card/95 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Neural News & Alerts</h3>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-1">
        {mockNews.map((news) => (
          <div key={news.id} className="p-2 bg-muted/30 rounded border border-border/30 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">{news.headline}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{news.summary}</p>
              </div>
              <Badge variant="outline" className={`${getSentimentColor(news.sentiment)} text-xs shrink-0`}>
                {news.sentiment}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{news.timestamp}</span>
                <Globe className="h-3 w-3 ml-1" />
                <span>{news.source}</span>
              </div>
              <div className="flex items-center gap-1">
                {news.relevantSymbols.slice(0, 2).map(symbol => (
                  <Badge key={symbol} variant="secondary" className="text-xs px-1 py-0">{symbol}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-border/50 pt-2 mt-2">
          <h4 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-primary" />
            Live Alerts
          </h4>
          {mockAlerts.map((alert) => (
            <div key={alert.id} className={`p-1.5 rounded mb-1 ${getPriorityColor(alert.priority)}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs px-1 py-0">{alert.symbol}</Badge>
                    <span className="text-xs text-foreground line-clamp-1">{alert.message}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};