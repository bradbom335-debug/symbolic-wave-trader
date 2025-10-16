-- Phase 2: Advanced Analytics Tables

-- Order Book Snapshots (L2/L3 market depth)
CREATE TABLE order_book_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  bids JSONB NOT NULL,
  asks JSONB NOT NULL,
  spread NUMERIC,
  bid_imbalance NUMERIC,
  mid_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orderbook_symbol_time ON order_book_snapshots(symbol, timestamp DESC);

-- Enable RLS
ALTER TABLE order_book_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view order book data"
ON order_book_snapshots FOR SELECT
TO public
USING (true);

-- Options Flow (Unusual options activity)
CREATE TABLE options_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  strike NUMERIC NOT NULL,
  expiry DATE NOT NULL,
  option_type TEXT CHECK (option_type IN ('call', 'put')),
  trade_type TEXT CHECK (trade_type IN ('sweep', 'block', 'split', 'normal')),
  premium NUMERIC,
  size INTEGER,
  oi_change INTEGER,
  iv NUMERIC,
  sentiment TEXT CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  detected_at TIMESTAMPTZ DEFAULT now(),
  is_unusual BOOLEAN DEFAULT false,
  confidence_score NUMERIC
);

CREATE INDEX idx_options_flow_symbol ON options_flow(symbol, detected_at DESC);
CREATE INDEX idx_options_flow_unusual ON options_flow(is_unusual, detected_at DESC) WHERE is_unusual = true;

ALTER TABLE options_flow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view options flow"
ON options_flow FOR SELECT
TO public
USING (true);

-- Portfolio Greeks
CREATE TABLE portfolio_greeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  position_size INTEGER,
  delta NUMERIC,
  gamma NUMERIC,
  theta NUMERIC,
  vega NUMERIC,
  rho NUMERIC,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_greeks_user ON portfolio_greeks(user_id, updated_at DESC);

ALTER TABLE portfolio_greeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own greeks"
ON portfolio_greeks FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Correlation Matrices
CREATE TABLE correlation_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_set TEXT[] NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('5m', '1h', '1d', '1w', '1M')),
  correlation_data JSONB NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_correlation_period ON correlation_matrices(period, calculated_at DESC);

ALTER TABLE correlation_matrices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view correlation matrices"
ON correlation_matrices FOR SELECT
TO public
USING (true);

-- Portfolio Positions
CREATE TABLE portfolio_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  avg_cost NUMERIC NOT NULL,
  current_price NUMERIC,
  unrealized_pnl NUMERIC,
  realized_pnl NUMERIC DEFAULT 0,
  position_type TEXT CHECK (position_type IN ('stock', 'option', 'future', 'crypto')),
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_positions_user ON portfolio_positions(user_id, updated_at DESC);

ALTER TABLE portfolio_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own positions"
ON portfolio_positions FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Portfolio Risk Metrics
CREATE TABLE portfolio_risk_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  calculation_date DATE NOT NULL,
  portfolio_value NUMERIC,
  var_95 NUMERIC,
  cvar_95 NUMERIC,
  sharpe_ratio NUMERIC,
  sortino_ratio NUMERIC,
  max_drawdown NUMERIC,
  beta_vs_spy NUMERIC,
  volatility NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_risk_metrics_user ON portfolio_risk_metrics(user_id, calculation_date DESC);

ALTER TABLE portfolio_risk_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own risk metrics"
ON portfolio_risk_metrics FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risk metrics"
ON portfolio_risk_metrics FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);