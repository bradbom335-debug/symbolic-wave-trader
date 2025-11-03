-- Phase 5: Autonomous Trading Engine Tables

-- Trading Strategies
CREATE TABLE IF NOT EXISTS public.trading_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  strategy_name TEXT NOT NULL,
  description TEXT,
  strategy_type TEXT NOT NULL, -- 'momentum', 'mean_reversion', 'arbitrage', 'ml_based', 'custom'
  strategy_logic JSONB NOT NULL DEFAULT '{}', -- Visual flow/code representation
  parameters JSONB NOT NULL DEFAULT '{}', -- Strategy parameters
  entry_rules JSONB NOT NULL DEFAULT '[]',
  exit_rules JSONB NOT NULL DEFAULT '[]',
  risk_rules JSONB NOT NULL DEFAULT '{}',
  symbols TEXT[] NOT NULL DEFAULT '{}',
  timeframe TEXT NOT NULL DEFAULT '5m',
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'backtested', 'paper', 'live', 'paused'
  is_active BOOLEAN DEFAULT false,
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Backtest Results
CREATE TABLE IF NOT EXISTS public.backtest_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  initial_capital NUMERIC NOT NULL DEFAULT 10000,
  final_capital NUMERIC NOT NULL,
  total_trades INTEGER NOT NULL DEFAULT 0,
  winning_trades INTEGER NOT NULL DEFAULT 0,
  losing_trades INTEGER NOT NULL DEFAULT 0,
  win_rate NUMERIC,
  profit_factor NUMERIC,
  sharpe_ratio NUMERIC,
  max_drawdown NUMERIC,
  total_return NUMERIC,
  avg_trade_return NUMERIC,
  trades_data JSONB NOT NULL DEFAULT '[]', -- All trade details
  equity_curve JSONB NOT NULL DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Paper Trades (simulated trades)
CREATE TABLE IF NOT EXISTS public.paper_trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  trade_type TEXT NOT NULL, -- 'long', 'short'
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  quantity INTEGER NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  exit_time TIMESTAMP WITH TIME ZONE,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  pnl NUMERIC,
  pnl_percent NUMERIC,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'closed', 'stopped'
  entry_reason TEXT,
  exit_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Strategy Executions (tracking live/paper execution sessions)
CREATE TABLE IF NOT EXISTS public.strategy_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL,
  user_id UUID NOT NULL,
  execution_mode TEXT NOT NULL, -- 'paper', 'live'
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'paused', 'stopped', 'error'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stopped_at TIMESTAMP WITH TIME ZONE,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  total_pnl NUMERIC DEFAULT 0,
  current_positions JSONB DEFAULT '[]',
  error_log JSONB DEFAULT '[]',
  performance_snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Risk Controls
CREATE TABLE IF NOT EXISTS public.risk_controls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  strategy_id UUID,
  max_position_size NUMERIC NOT NULL DEFAULT 1000,
  max_daily_loss NUMERIC NOT NULL DEFAULT 500,
  max_total_exposure NUMERIC NOT NULL DEFAULT 5000,
  max_drawdown_percent NUMERIC NOT NULL DEFAULT 20,
  max_trades_per_day INTEGER NOT NULL DEFAULT 10,
  max_correlation NUMERIC NOT NULL DEFAULT 0.7,
  stop_loss_percent NUMERIC NOT NULL DEFAULT 2,
  take_profit_percent NUMERIC NOT NULL DEFAULT 5,
  is_enabled BOOLEAN DEFAULT true,
  emergency_stop BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_controls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trading_strategies
CREATE POLICY "Users can manage their own strategies"
  ON public.trading_strategies
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for backtest_results
CREATE POLICY "Users can view their own backtest results"
  ON public.backtest_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create backtest results"
  ON public.backtest_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for paper_trades
CREATE POLICY "Users can manage their own paper trades"
  ON public.paper_trades
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for strategy_executions
CREATE POLICY "Users can manage their own executions"
  ON public.strategy_executions
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for risk_controls
CREATE POLICY "Users can manage their own risk controls"
  ON public.risk_controls
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trading_strategies_user ON public.trading_strategies(user_id);
CREATE INDEX idx_backtest_results_strategy ON public.backtest_results(strategy_id);
CREATE INDEX idx_paper_trades_strategy ON public.paper_trades(strategy_id);
CREATE INDEX idx_paper_trades_status ON public.paper_trades(status);
CREATE INDEX idx_strategy_executions_user ON public.strategy_executions(user_id);
CREATE INDEX idx_risk_controls_user ON public.risk_controls(user_id);