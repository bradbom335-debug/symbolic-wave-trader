-- Phase 1: Critical Foundation Database Schema

-- Table for workspace presets
CREATE TABLE IF NOT EXISTS workspace_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preset_name TEXT NOT NULL,
  preset_type TEXT NOT NULL CHECK (preset_type IN ('day_trading', 'swing_analysis', 'options_trading', 'risk_management', 'custom')),
  panel_config JSONB NOT NULL DEFAULT '[]',
  hotkey_bindings JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE workspace_presets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspace_presets
CREATE POLICY "Users can view their own workspace presets"
  ON workspace_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspace presets"
  ON workspace_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspace presets"
  ON workspace_presets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspace presets"
  ON workspace_presets FOR DELETE
  USING (auth.uid() = user_id);

-- Table for panel linking (synchronized panels)
CREATE TABLE IF NOT EXISTS panel_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspace_presets(id) ON DELETE CASCADE NOT NULL,
  link_group_id TEXT NOT NULL,
  panel_ids TEXT[] NOT NULL,
  linked_symbol TEXT,
  sync_timeframe BOOLEAN DEFAULT true,
  sync_indicators BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE panel_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for panel_links
CREATE POLICY "Users can view panel links for their workspaces"
  ON panel_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_presets
      WHERE workspace_presets.id = panel_links.workspace_id
      AND workspace_presets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage panel links for their workspaces"
  ON panel_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_presets
      WHERE workspace_presets.id = panel_links.workspace_id
      AND workspace_presets.user_id = auth.uid()
    )
  );

-- Table for custom hotkeys
CREATE TABLE IF NOT EXISTS panel_hotkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hotkey TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('open_panel', 'switch_workspace', 'execute_trade', 'create_alert', 'export_data')),
  action_config JSONB NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, hotkey)
);

-- Enable RLS
ALTER TABLE panel_hotkeys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for panel_hotkeys
CREATE POLICY "Users can view their own hotkeys"
  ON panel_hotkeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hotkeys"
  ON panel_hotkeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hotkeys"
  ON panel_hotkeys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hotkeys"
  ON panel_hotkeys FOR DELETE
  USING (auth.uid() = user_id);

-- Table for volume profiles
CREATE TABLE IF NOT EXISTS volume_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  date DATE NOT NULL,
  timeframe TEXT NOT NULL,
  price_levels JSONB NOT NULL,
  poc NUMERIC,
  val NUMERIC,
  vah NUMERIC,
  total_volume BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(symbol, date, timeframe)
);

-- Enable RLS
ALTER TABLE volume_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for volume_profiles (public read)
CREATE POLICY "Anyone can view volume profiles"
  ON volume_profiles FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage volume profiles"
  ON volume_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspace_presets_user ON workspace_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_panel_links_workspace ON panel_links(workspace_id);
CREATE INDEX IF NOT EXISTS idx_panel_hotkeys_user ON panel_hotkeys(user_id);
CREATE INDEX IF NOT EXISTS idx_volume_profiles_symbol_date ON volume_profiles(symbol, date DESC);

-- Trigger for updated_at on workspace_presets
CREATE OR REPLACE FUNCTION update_workspace_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspace_presets_updated_at
  BEFORE UPDATE ON workspace_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_workspace_presets_updated_at();