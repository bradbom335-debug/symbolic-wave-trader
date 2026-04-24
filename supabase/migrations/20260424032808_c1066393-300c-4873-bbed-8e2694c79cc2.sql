create table if not exists public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  shares numeric not null check (shares >= 0),
  avg_price numeric not null check (avg_price >= 0),
  asset_class text not null default 'equity',
  sector text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_holdings_user_idx on public.portfolio_holdings(user_id);

create table if not exists public.user_app_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  default_symbol text not null default 'AAPL',
  default_timeframe text not null default '1d',
  theme text not null default 'neural-dark',
  refresh_interval_ms integer not null default 5000 check (refresh_interval_ms >= 500),
  risk_tolerance text not null default 'moderate',
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  panels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, name)
);
create index if not exists dashboard_layouts_user_idx on public.dashboard_layouts(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_holdings_updated on public.portfolio_holdings;
create trigger trg_holdings_updated before update on public.portfolio_holdings
for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.user_app_settings;
create trigger trg_settings_updated before update on public.user_app_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_layouts_updated on public.dashboard_layouts;
create trigger trg_layouts_updated before update on public.dashboard_layouts
for each row execute function public.set_updated_at();

alter table public.portfolio_holdings enable row level security;
alter table public.user_app_settings enable row level security;
alter table public.dashboard_layouts enable row level security;

drop policy if exists "holdings_select_own" on public.portfolio_holdings;
create policy "holdings_select_own" on public.portfolio_holdings
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "holdings_insert_own" on public.portfolio_holdings;
create policy "holdings_insert_own" on public.portfolio_holdings
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "holdings_update_own" on public.portfolio_holdings;
create policy "holdings_update_own" on public.portfolio_holdings
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "holdings_delete_own" on public.portfolio_holdings;
create policy "holdings_delete_own" on public.portfolio_holdings
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "settings_select_own" on public.user_app_settings;
create policy "settings_select_own" on public.user_app_settings
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "settings_insert_own" on public.user_app_settings;
create policy "settings_insert_own" on public.user_app_settings
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "settings_update_own" on public.user_app_settings;
create policy "settings_update_own" on public.user_app_settings
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "layouts_select_own" on public.dashboard_layouts;
create policy "layouts_select_own" on public.dashboard_layouts
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "layouts_insert_own" on public.dashboard_layouts;
create policy "layouts_insert_own" on public.dashboard_layouts
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "layouts_update_own" on public.dashboard_layouts;
create policy "layouts_update_own" on public.dashboard_layouts
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "layouts_delete_own" on public.dashboard_layouts;
create policy "layouts_delete_own" on public.dashboard_layouts
for delete to authenticated using (auth.uid() = user_id);