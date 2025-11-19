import { Card } from '@/components/ui/card';
import { Rss } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  symbol: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
}

const newsItems: NewsItem[] = [
  { id: '1', title: 'Fed signals potential rate cut in Q2 2024', symbol: 'SPY', time: '5m', impact: 'high' },
  { id: '2', title: 'NVDA beats earnings, guides higher for AI chips', symbol: 'NVDA', time: '15m', impact: 'high' },
  { id: '3', title: 'AAPL announces new AI partnership with GOOGL', symbol: 'AAPL', time: '23m', impact: 'medium' },
  { id: '4', title: 'Oil prices surge on Middle East tensions', symbol: 'XLE', time: '45m', impact: 'high' },
  { id: '5', title: 'TSLA recalls 2M vehicles over autopilot issue', symbol: 'TSLA', time: '1h', impact: 'medium' },
  { id: '6', title: 'Tech sector leads market rally, up 2.3%', symbol: 'XLK', time: '1h', impact: 'medium' },
  { id: '7', title: 'Consumer confidence index beats expectations', symbol: 'SPY', time: '2h', impact: 'low' },
  { id: '8', title: 'Bitcoin breaks $45K resistance level', symbol: 'BTC', time: '2h', impact: 'medium' }
];

export const NewsAndAlerts = () => {
  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">News & Alerts</h3>
        <div className="flex items-center gap-1">
          <Rss className="h-3 w-3 text-[hsl(var(--terminal-blue))]" />
          <span className="text-[9px] font-mono text-[hsl(var(--terminal-blue))]">FEED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="space-y-1">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1.5 rounded hover:bg-[hsl(var(--terminal-bg-elevated))]/70 transition-colors cursor-pointer">
              <div className="flex items-start gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full mt-1 flex-shrink-0 ${
                  item.impact === 'high' ? 'bg-[hsl(var(--terminal-red))]' : 
                  item.impact === 'medium' ? 'bg-[hsl(var(--terminal-yellow))]' : 
                  'bg-[hsl(var(--terminal-blue))]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-foreground leading-tight mb-0.5">{item.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-[hsl(var(--terminal-blue))]">{item.symbol}</span>
                    <span className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))]">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};