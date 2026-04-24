import { useEffect, useRef, useState } from 'react';

export interface LiveQuote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  updatedAt: number;
}

const SEED_PRICES: Record<string, number> = {
  AAPL: 178.45, MSFT: 412.30, GOOGL: 142.10, AMZN: 145.20, NVDA: 875.30,
  META: 485.20, TSLA: 185.75, AMD: 165.40, NFLX: 612.50, AVGO: 1340.20,
  SPY: 520.10, QQQ: 445.60, IWM: 215.40, DIA: 388.20,
};

function seedPrice(symbol: string): number {
  if (SEED_PRICES[symbol]) return SEED_PRICES[symbol];
  let h = 0;
  for (const c of symbol) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 50 + (h % 800);
}

interface FeedState {
  quotes: Record<string, LiveQuote>;
  subscribers: Set<() => void>;
  timer: number | null;
  intervalMs: number;
}

const feed: FeedState = {
  quotes: {},
  subscribers: new Set(),
  timer: null,
  intervalMs: 2500,
};

function tick() {
  const now = Date.now();
  for (const sym of Object.keys(feed.quotes)) {
    const q = feed.quotes[sym];
    // small mean-reverting random walk
    const drift = (Math.random() - 0.5) * q.price * 0.002;
    const meanRev = (q.prevClose - q.price) * 0.0008;
    const next = Math.max(0.01, q.price + drift + meanRev);
    const change = next - q.prevClose;
    feed.quotes[sym] = {
      symbol: sym,
      price: +next.toFixed(2),
      prevClose: q.prevClose,
      change: +change.toFixed(2),
      changePct: +((change / q.prevClose) * 100).toFixed(2),
      updatedAt: now,
    };
  }
  feed.subscribers.forEach((cb) => cb());
}

function ensureRunning() {
  if (feed.timer != null) return;
  feed.timer = window.setInterval(tick, feed.intervalMs);
}

function maybeStop() {
  if (feed.subscribers.size === 0 && feed.timer != null) {
    clearInterval(feed.timer);
    feed.timer = null;
  }
}

export function setLiveFeedInterval(ms: number) {
  feed.intervalMs = Math.max(500, ms);
  if (feed.timer != null) {
    clearInterval(feed.timer);
    feed.timer = null;
    if (feed.subscribers.size > 0) ensureRunning();
  }
}

function ensureSeeded(symbols: string[]) {
  for (const sym of symbols) {
    if (!feed.quotes[sym]) {
      const seed = seedPrice(sym);
      feed.quotes[sym] = {
        symbol: sym,
        price: seed,
        prevClose: seed,
        change: 0,
        changePct: 0,
        updatedAt: Date.now(),
      };
    }
  }
}

export function useLivePrices(symbols: string[]): Record<string, LiveQuote> {
  const [, setVersion] = useState(0);
  const symsRef = useRef<string[]>(symbols);
  symsRef.current = symbols;

  useEffect(() => {
    ensureSeeded(symbols);
    const cb = () => setVersion((v) => v + 1);
    feed.subscribers.add(cb);
    ensureRunning();
    setVersion((v) => v + 1);
    return () => {
      feed.subscribers.delete(cb);
      maybeStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(',')]);

  const out: Record<string, LiveQuote> = {};
  for (const sym of symbols) if (feed.quotes[sym]) out[sym] = feed.quotes[sym];
  return out;
}

export function useLivePrice(symbol: string): LiveQuote | undefined {
  return useLivePrices([symbol])[symbol];
}
