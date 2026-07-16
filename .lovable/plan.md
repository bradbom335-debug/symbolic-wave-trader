
# Production Market Data Layer — Deep Polish

Goal: replace the simulated price feed with a real hybrid data pipeline (Finnhub WebSocket for real-time trades, Alpha Vantage for historical bars, fundamentals, and technicals), and rewire every panel to consume it. No auth — demo mode preserved. Deep focus on correctness, resilience, caching, and UX polish over new features.

## What ships

### 1. Backend: data pipeline (edge functions)

- `market-quote` — GET quote for a symbol from Finnhub `/quote` (fallback: Alpha Vantage `GLOBAL_QUOTE`). Response cached 5s server-side.
- `market-history` — OHLCV bars (`1D/1W/1M/3M/1Y/5Y`) from Alpha Vantage `TIME_SERIES_*`. Cached 60s–1h based on range.
- `market-search` — symbol search via Finnhub `/search`.
- `market-profile` — company profile + fundamentals (Finnhub `/stock/profile2`, `/stock/metric`).
- `market-news` — per-symbol + market news, replaces the current news mock (Finnhub `/news`).
- `finnhub-ws-token` — mints a short-lived signed payload (Finnhub key server-side; browser opens WS directly using key returned only after simple rate check). If the key must stay fully server-side, a lightweight relay function proxies the WS instead.

All functions: CORS headers, Zod-validated inputs, structured error envelope, `Cache-Control` hints, retry with exponential backoff, and a shared response cache in a `market_cache` table (see migration).

### 2. Database (Lovable Cloud)

New tables (public, service_role write, anon read for cache reads is not needed — functions use service_role):

- `market_cache(key text pk, payload jsonb, expires_at timestamptz)` — server-side response cache, no client access.
- `symbols_watchlist(id, symbol, added_at)` — demo-mode shared watchlist (no user_id since no auth); anon read+write allowed with row-count guardrails.

RLS + GRANTs written in the same migration. No changes to existing `portfolio_holdings`, `user_app_settings`, `dashboard_layouts`.

### 3. Frontend: live data hook rewrite

- Replace `src/hooks/useLivePrices.ts` internals: keep the same public API (`useLivePrices`, `useLivePrice`, `setLiveFeedInterval`) so no call sites break. New implementation:
  - Opens a single Finnhub WebSocket, subscribes/unsubscribes symbols by reference-count.
  - Seeds initial `price/prevClose` from `market-quote` on first subscribe.
  - Falls back to Alpha Vantage polling if WS fails or key missing.
  - Exposes `connectionStatus: 'live' | 'polling' | 'offline'` for a status badge.
- New `useSymbolHistory(symbol, range)` hook — TanStack Query wrapper around `market-history`.
- New `useSymbolSearch(q)` hook — debounced.
- New `useSymbolNews(symbol)` hook.

### 4. Panels rewired (every touchpoint)

- `AdvancedTradingChart` — real OHLC from `useSymbolHistory`, timeframe selector, real volume, real last price.
- `MarketIntelligenceHub` — real quotes from `useLivePrices`, real change %.
- `MultiStockGraph3D` + `/3d-graph` page — real historical wave shapes (normalized close series), live tips reflect real prices.
- `AdvancedPortfolioAnalytics` + `Portfolio` — holdings valued off real live prices, real day change, real P/L.
- `AIStockAnalysis` — pulls real history + real news into the AI edge function prompt (already exists) instead of mock context.
- `NewsAndAlerts` / `NewsPanel` — `useSymbolNews`.
- `AlertsPanel` — real price triggers evaluated against live feed.
- `BottomStatusBar` / `TopCommandBar` — show live connection status pill (LIVE / DELAYED / OFFLINE), last tick timestamp, market open/closed indicator (NYSE hours).

### 5. Resilience + UX polish (the "depth")

- Skeleton loaders and empty states in every rewired panel.
- Rate-limit-aware error toasts (single toast per burst).
- Automatic reconnect with backoff for WS; visible reconnecting indicator.
- Symbol validation before subscribe (rejects garbage tickers cleanly).
- SEO: real `<title>`/meta on each route via a tiny `usePageMeta` hook.
- Accessibility pass on the new status pill and skeletons (aria-live, aria-busy).

### 6. Secret

- `FINNHUB_API_KEY` — requested via `add_secret` at the start of build. Alpha Vantage key already present.

## Technical notes

Files created:
- `supabase/functions/market-quote/index.ts`
- `supabase/functions/market-history/index.ts`
- `supabase/functions/market-search/index.ts`
- `supabase/functions/market-profile/index.ts`
- `supabase/functions/market-news/index.ts`
- `supabase/functions/_shared/market-cache.ts` (shared cache helper)
- `supabase/migrations/<ts>_market_cache.sql`
- `src/hooks/useSymbolHistory.ts`
- `src/hooks/useSymbolSearch.ts`
- `src/hooks/useSymbolNews.ts`
- `src/hooks/useMarketStatus.ts`
- `src/lib/marketApi.ts` (typed client for the edge functions)

Files rewritten:
- `src/hooks/useLivePrices.ts` (Finnhub WS + AV fallback, same exports)
- `src/components/advanced/AdvancedTradingChart.tsx`
- `src/components/advanced/MarketIntelligenceHub.tsx`
- `src/components/advanced/MultiStockGraph3D.tsx` (data source only; keep all 3D features)
- `src/components/advanced/AdvancedPortfolioAnalytics.tsx`
- `src/components/advanced/NewsAndAlerts.tsx`
- `src/components/trading-os/panels/NewsPanel.tsx`
- `src/components/trading-os/panels/AlertsPanel.tsx`
- `src/components/trading-os/BottomStatusBar.tsx`
- `src/pages/Portfolio.tsx` (only the price-source lines)

Untouched: auth (none), workspace store, layout, design tokens, existing AI edge functions besides passing real context.

## Out of scope this pass

Pattern-overlay drawing on charts, drag-rearrange dashboard, mobile layout, real order routing, backtesting engine — these are the next passes once the data layer is production-solid.
