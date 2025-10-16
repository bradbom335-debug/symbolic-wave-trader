import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  bidImbalance: number;
}

export function OrderBookPanel({ symbol = 'AAPL' }: { symbol?: string }) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockData: OrderBookData = {
      bids: Array.from({ length: 15 }, (_, i) => ({
        price: 175.5 - i * 0.05,
        size: Math.floor(Math.random() * 10000) + 100,
        total: Math.floor(Math.random() * 50000) + 1000,
      })),
      asks: Array.from({ length: 15 }, (_, i) => ({
        price: 175.55 + i * 0.05,
        size: Math.floor(Math.random() * 10000) + 100,
        total: Math.floor(Math.random() * 50000) + 1000,
      })),
      spread: 0.05,
      bidImbalance: 0.12,
    };

    setTimeout(() => {
      setOrderBook(mockData);
      setLoading(false);
    }, 500);
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-terminal-blue" />
      </div>
    );
  }

  if (!orderBook) return null;

  const maxBidSize = Math.max(...orderBook.bids.map(b => b.size));
  const maxAskSize = Math.max(...orderBook.asks.map(a => a.size));
  const maxSize = Math.max(maxBidSize, maxAskSize);

  return (
    <Card className="h-full bg-terminal-bg-panel border-terminal-bg-elevated overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-3 py-2 border-b border-terminal-bg-elevated bg-terminal-bg-deep">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-terminal-primary">Order Book</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-text-terminal-muted">Spread:</span>
              <span className="text-terminal-gold font-mono">${orderBook.spread.toFixed(2)}</span>
              <span className="text-text-terminal-muted">Imbalance:</span>
              <span className={`font-mono ${orderBook.bidImbalance > 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {(orderBook.bidImbalance * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Order Book Data */}
        <div className="flex-1 overflow-auto">
          {/* Column Headers */}
          <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold text-text-terminal-muted bg-terminal-bg-deep sticky top-0 z-10">
            <div className="text-right">Size</div>
            <div className="text-center">Price</div>
            <div className="text-left">Total</div>
          </div>

          {/* Asks (in reverse order) */}
          <div className="px-3">
            {[...orderBook.asks].reverse().map((ask, i) => (
              <div key={`ask-${i}`} className="relative grid grid-cols-3 gap-2 py-1 text-xs font-mono">
                <div
                  className="absolute inset-0 bg-terminal-red/10"
                  style={{ width: `${(ask.size / maxSize) * 100}%`, right: 0, left: 'auto' }}
                />
                <div className="text-right text-text-terminal-primary relative z-10">{ask.size.toLocaleString()}</div>
                <div className="text-center text-terminal-red relative z-10">{ask.price.toFixed(2)}</div>
                <div className="text-left text-text-terminal-secondary relative z-10">{ask.total.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Spread Separator */}
          <div className="px-3 py-2 text-center">
            <div className="border-t border-terminal-gold/30" />
          </div>

          {/* Bids */}
          <div className="px-3">
            {orderBook.bids.map((bid, i) => (
              <div key={`bid-${i}`} className="relative grid grid-cols-3 gap-2 py-1 text-xs font-mono">
                <div
                  className="absolute inset-0 bg-terminal-green/10"
                  style={{ width: `${(bid.size / maxSize) * 100}%` }}
                />
                <div className="text-right text-text-terminal-primary relative z-10">{bid.size.toLocaleString()}</div>
                <div className="text-center text-terminal-green relative z-10">{bid.price.toFixed(2)}</div>
                <div className="text-left text-text-terminal-secondary relative z-10">{bid.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
