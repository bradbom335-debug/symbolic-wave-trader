-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Phase 1: Enhanced Data Ingestion Tables

-- Market Data History (OHLCV warehouse)
CREATE TABLE IF NOT EXISTS public.market_data_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume BIGINT NOT NULL,
  data_source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(symbol, timeframe, timestamp)
);

CREATE INDEX idx_market_data_symbol_time ON public.market_data_history(symbol, timestamp DESC);
CREATE INDEX idx_market_data_timeframe ON public.market_data_history(timeframe, timestamp DESC);

ALTER TABLE public.market_data_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market data"
ON public.market_data_history FOR SELECT
USING (true);

-- Technical Indicators
CREATE TABLE IF NOT EXISTS public.technical_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  indicator_type TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  values JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(symbol, timestamp, indicator_type, timeframe)
);

CREATE INDEX idx_tech_indicators_symbol ON public.technical_indicators(symbol, timestamp DESC);

ALTER TABLE public.technical_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view technical indicators"
ON public.technical_indicators FOR SELECT
USING (true);

-- Market News
CREATE TABLE IF NOT EXISTS public.market_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  symbols TEXT[] DEFAULT '{}',
  entities JSONB DEFAULT '{}',
  sentiment_score NUMERIC,
  sentiment_magnitude NUMERIC,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(url)
);

CREATE INDEX idx_market_news_symbols ON public.market_news USING GIN(symbols);
CREATE INDEX idx_market_news_published ON public.market_news(published_at DESC);

ALTER TABLE public.market_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market news"
ON public.market_news FOR SELECT
USING (true);

-- Social Sentiment
CREATE TABLE IF NOT EXISTS public.social_sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  platform TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  mention_count INTEGER DEFAULT 0,
  bullish_count INTEGER DEFAULT 0,
  bearish_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  avg_sentiment NUMERIC,
  volume_weighted_sentiment NUMERIC,
  top_posts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(symbol, platform, timestamp)
);

CREATE INDEX idx_social_sentiment_symbol ON public.social_sentiment(symbol, timestamp DESC);

ALTER TABLE public.social_sentiment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social sentiment"
ON public.social_sentiment FOR SELECT
USING (true);

-- Market Embeddings
CREATE TABLE IF NOT EXISTS public.market_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  text_content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_embeddings_type ON public.market_embeddings(content_type, content_id);

ALTER TABLE public.market_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view embeddings"
ON public.market_embeddings FOR SELECT
USING (true);

-- Agent Predictions
CREATE TABLE IF NOT EXISTS public.agent_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  prediction_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  target_timeframe TEXT NOT NULL,
  direction TEXT NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  key_signals JSONB DEFAULT '{}',
  market_data_snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_agent_predictions_symbol ON public.agent_predictions(symbol, prediction_time DESC);
CREATE INDEX idx_agent_predictions_agent ON public.agent_predictions(agent_id, prediction_time DESC);

ALTER TABLE public.agent_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active agent predictions"
ON public.agent_predictions FOR SELECT
USING (true);

-- Prediction Outcomes
CREATE TABLE IF NOT EXISTS public.prediction_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES public.agent_predictions(id) ON DELETE CASCADE,
  actual_direction TEXT NOT NULL,
  actual_price_change NUMERIC NOT NULL,
  directional_accuracy BOOLEAN NOT NULL,
  magnitude_error NUMERIC,
  evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(prediction_id)
);

ALTER TABLE public.prediction_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prediction outcomes"
ON public.prediction_outcomes FOR SELECT
USING (true);

-- Agent Performance Metrics
CREATE TABLE IF NOT EXISTS public.agent_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  total_predictions INTEGER NOT NULL DEFAULT 0,
  correct_predictions INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC,
  avg_confidence NUMERIC,
  confidence_calibration NUMERIC,
  performance_by_symbol JSONB DEFAULT '{}',
  performance_by_timeframe JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(agent_id, period_start, period_end)
);

CREATE INDEX idx_agent_performance_agent ON public.agent_performance(agent_id, period_end DESC);

ALTER TABLE public.agent_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agent performance"
ON public.agent_performance FOR SELECT
USING (true);

-- Visual Patterns
CREATE TABLE IF NOT EXISTS public.visual_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  chart_url TEXT NOT NULL,
  detected_patterns JSONB DEFAULT '[]',
  support_levels NUMERIC[] DEFAULT '{}',
  resistance_levels NUMERIC[] DEFAULT '{}',
  trend_lines JSONB DEFAULT '[]',
  vision_api_response JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_visual_patterns_symbol ON public.visual_patterns(symbol, timestamp DESC);

ALTER TABLE public.visual_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visual patterns"
ON public.visual_patterns FOR SELECT
USING (true);

-- Composite Arms Reference
CREATE TABLE IF NOT EXISTS public.composite_arms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulus INTEGER NOT NULL,
  arm INTEGER NOT NULL,
  entropy NUMERIC NOT NULL,
  avg_returns NUMERIC,
  sample_size INTEGER DEFAULT 0,
  historical_outcomes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(modulus, arm)
);

CREATE INDEX idx_composite_arms_modulus ON public.composite_arms(modulus);

ALTER TABLE public.composite_arms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view composite arms"
ON public.composite_arms FOR SELECT
USING (true);

-- Alert Rules
CREATE TABLE IF NOT EXISTS public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  delivery_channels TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_alert_rules_user ON public.alert_rules(user_id);
CREATE INDEX idx_alert_rules_symbol ON public.alert_rules(symbol) WHERE is_active = true;

ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own alert rules"
ON public.alert_rules
FOR ALL
USING (auth.uid() = user_id);

-- Alert History
CREATE TABLE IF NOT EXISTS public.alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  message TEXT NOT NULL,
  delivery_channel TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_alert_history_user ON public.alert_history(user_id, sent_at DESC);

ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alert history"
ON public.alert_history FOR SELECT
USING (auth.uid() = user_id);

-- Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS public.kg_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(768),
  importance_score NUMERIC DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(entity_type, entity_name)
);

CREATE INDEX idx_kg_nodes_type ON public.kg_nodes(entity_type);
CREATE INDEX idx_kg_nodes_name ON public.kg_nodes(entity_name);

ALTER TABLE public.kg_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view knowledge graph nodes"
ON public.kg_nodes FOR SELECT
USING (true);

-- Knowledge Graph Edges
CREATE TABLE IF NOT EXISTS public.kg_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id UUID REFERENCES public.kg_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES public.kg_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 0.5 CHECK (weight >= 0 AND weight <= 1),
  confidence NUMERIC NOT NULL DEFAULT 0.5,
  evidence JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_node_id, target_node_id, relationship_type)
);

CREATE INDEX idx_kg_edges_source ON public.kg_edges(source_node_id);
CREATE INDEX idx_kg_edges_target ON public.kg_edges(target_node_id);
CREATE INDEX idx_kg_edges_type ON public.kg_edges(relationship_type);

ALTER TABLE public.kg_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view knowledge graph edges"
ON public.kg_edges FOR SELECT
USING (true);

-- Memory Archives
CREATE TABLE IF NOT EXISTS public.memory_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  original_size_bytes BIGINT NOT NULL,
  compressed_size_bytes BIGINT NOT NULL,
  compression_ratio NUMERIC,
  gcs_url TEXT NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_memory_archives_session ON public.memory_archives(session_id);

ALTER TABLE public.memory_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memory archives"
ON public.memory_archives FOR SELECT
USING (true);

-- User Roles System (SECURITY CRITICAL)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'premium', 'free');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Security Definer Function for Role Checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Triggers
CREATE TRIGGER update_agent_performance_updated_at
BEFORE UPDATE ON public.agent_performance
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_composite_arms_updated_at
BEFORE UPDATE ON public.composite_arms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at
BEFORE UPDATE ON public.alert_rules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kg_nodes_updated_at
BEFORE UPDATE ON public.kg_nodes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kg_edges_updated_at
BEFORE UPDATE ON public.kg_edges
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();