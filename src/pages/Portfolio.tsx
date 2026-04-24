import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import {
  Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon,
  Activity, Brain, Sparkles, Wallet,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar, Legend,
} from 'recharts';
import { useLivePrices } from '@/hooks/useLivePrices';

interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avg_price: number;
  asset_class: string;
  sector: string | null;
  notes: string | null;
}

interface Optimization {
  overall_score: number;
  diversification_score: number;
  risk_score: number;
  concentration_warning?: string;
  sector_exposure?: Array<{ sector: string; weight_pct: number; comment?: string }>;
  suggestions: Array<{
    action: string; symbol: string; target_weight_pct?: number;
    rationale: string; priority: 'low' | 'medium' | 'high';
  }>;
  rebalanced_allocation?: Array<{
    symbol: string; current_weight_pct: number; target_weight_pct: number;
  }>;
  summary: string;
}

const PIE_COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

const Portfolio = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const [sector, setSector] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [goals, setGoals] = useState('Long-term capital growth with moderate income');
  const [optimization, setOptimization] = useState<Optimization | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  const symbols = useMemo(() => holdings.map(h => h.symbol), [holdings]);
  const live = useLivePrices(symbols);

  const fetchHoldings = async () => {
    if (!user) {
      setHoldings([]);
      return;
    }
    const { data, error } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setHoldings((data || []) as Holding[]);
  };

  useEffect(() => { fetchHoldings(); /* eslint-disable-next-line */ }, [user?.id]);

  const enriched = useMemo(() => {
    return holdings.map(h => {
      const q = live[h.symbol];
      const currentPrice = q?.price ?? h.avg_price;
      const value = currentPrice * h.shares;
      const cost = h.avg_price * h.shares;
      const pl = value - cost;
      const plPct = cost > 0 ? (pl / cost) * 100 : 0;
      const dayChange = (q?.change ?? 0) * h.shares;
      return { ...h, currentPrice, value, cost, pl, plPct, dayChange };
    });
  }, [holdings, live]);

  const totals = useMemo(() => {
    const value = enriched.reduce((s, p) => s + p.value, 0);
    const cost = enriched.reduce((s, p) => s + p.cost, 0);
    const pl = value - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    const dayChange = enriched.reduce((s, p) => s + p.dayChange, 0);
    const dayChangePct = value > 0 ? (dayChange / (value - dayChange)) * 100 : 0;
    return { value, cost, pl, plPct, dayChange, dayChangePct };
  }, [enriched]);

  const allocation = useMemo(() =>
    enriched.map((p, i) => ({
      name: p.symbol,
      value: +p.value.toFixed(2),
      color: PIE_COLORS[i % PIE_COLORS.length],
    })), [enriched]);

  const sectorAlloc = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of enriched) {
      const k = p.sector || 'Unclassified';
      map.set(k, (map.get(k) || 0) + p.value);
    }
    return Array.from(map.entries()).map(([sector, value]) => ({ sector, value }));
  }, [enriched]);

  const performance = useMemo(() => {
    // synthesized performance trail using current values
    const v = totals.value || 1;
    return Array.from({ length: 24 }, (_, i) => ({
      t: `${i}`,
      value: +(v * (0.9 + Math.sin(i / 3) * 0.04 + (i / 24) * 0.1)).toFixed(2),
    }));
  }, [totals.value]);

  const addHolding = async () => {
    if (!user) {
      toast.error('Sign in to save holdings');
      return;
    }
    if (!symbol || !shares || !price) {
      toast.error('Fill symbol, shares, and price');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('portfolio_holdings').insert({
      user_id: user.id,
      symbol: symbol.toUpperCase(),
      shares: Number(shares),
      avg_price: Number(price),
      sector: sector || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSymbol(''); setShares(''); setPrice(''); setSector('');
    toast.success('Holding added');
    fetchHoldings();
  };

  const removeHolding = async (id: string) => {
    const { error } = await supabase.from('portfolio_holdings').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    fetchHoldings();
  };

  const runOptimization = async () => {
    if (enriched.length === 0) { toast.error('Add holdings first'); return; }
    setOptimizing(true);
    try {
      const payload = enriched.map(p => ({
        symbol: p.symbol,
        shares: p.shares,
        avg_price: p.avg_price,
        current_price: p.currentPrice,
        value: p.value,
        weight_pct: totals.value > 0 ? (p.value / totals.value) * 100 : 0,
        sector: p.sector,
      }));
      const { data, error } = await supabase.functions.invoke('portfolio-optimizer', {
        body: { holdings: payload, riskTolerance, goals },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setOptimization(data as Optimization);
      toast.success('AI optimization ready');
    } catch (e: any) {
      toast.error(e.message || 'Optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  const actionColor = (a: string) => {
    if (['buy', 'add'].includes(a)) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (['sell', 'trim'].includes(a)) return 'bg-red-500/15 text-red-400 border-red-500/30';
    if (a === 'hedge') return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Card><CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Portfolio Value</span>
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">${totals.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className={`text-[11px] ${totals.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totals.dayChange >= 0 ? '+' : ''}${totals.dayChange.toFixed(2)} today
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total P/L</span>
            {totals.pl >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
          </div>
          <div className={`text-xl font-bold ${totals.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totals.pl >= 0 ? '+' : ''}${totals.pl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] ${totals.plPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totals.plPct >= 0 ? '+' : ''}{totals.plPct.toFixed(2)}%
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Cost Basis</span>
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">${totals.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-muted-foreground">{enriched.length} positions</div>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Diversification</span>
            <PieIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">{optimization ? optimization.diversification_score.toFixed(0) : '—'}</div>
          <Progress value={optimization?.diversification_score ?? 0} className="h-1 mt-1" />
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Risk Score</span>
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold">{optimization ? optimization.risk_score.toFixed(0) : '—'}</div>
          <Progress value={optimization?.risk_score ?? 0} className="h-1 mt-1" />
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Performance</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="t" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm flex items-center gap-2"><PieIcon className="h-4 w-4 text-primary" /> Allocation</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={allocation} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={3} dataKey="value">
                    {allocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector exposure */}
      {sectorAlloc.length > 0 && (
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm">Sector Exposure</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorAlloc}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="sector" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Optimizer */}
      <Card>
        <CardHeader className="py-2 px-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> AI Portfolio Optimizer</CardTitle>
          <Button size="sm" onClick={runOptimization} disabled={optimizing || enriched.length === 0}>
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {optimizing ? 'Analyzing…' : 'Run Optimization'}
          </Button>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Risk Tolerance</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label className="text-xs">Goals</Label>
              <Textarea rows={1} value={goals} onChange={(e) => setGoals(e.target.value)} className="resize-none" />
            </div>
          </div>

          {optimization && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border border-border p-2">
                  <div className="text-[10px] text-muted-foreground uppercase">Overall</div>
                  <div className="text-lg font-bold">{optimization.overall_score.toFixed(0)}</div>
                  <Progress value={optimization.overall_score} className="h-1 mt-1" />
                </div>
                <div className="rounded border border-border p-2">
                  <div className="text-[10px] text-muted-foreground uppercase">Diversification</div>
                  <div className="text-lg font-bold">{optimization.diversification_score.toFixed(0)}</div>
                  <Progress value={optimization.diversification_score} className="h-1 mt-1" />
                </div>
                <div className="rounded border border-border p-2">
                  <div className="text-[10px] text-muted-foreground uppercase">Risk</div>
                  <div className="text-lg font-bold">{optimization.risk_score.toFixed(0)}</div>
                  <Progress value={optimization.risk_score} className="h-1 mt-1" />
                </div>
              </div>

              <div className="text-xs text-muted-foreground italic">{optimization.summary}</div>
              {optimization.concentration_warning && (
                <div className="text-xs text-amber-400">⚠ {optimization.concentration_warning}</div>
              )}

              <div className="space-y-1.5">
                <div className="text-xs font-medium uppercase text-muted-foreground">Suggestions</div>
                {optimization.suggestions.map((s, i) => (
                  <div key={i} className="rounded border border-border p-2 flex items-start gap-2">
                    <Badge className={`text-[10px] uppercase ${actionColor(s.action)}`}>{s.action}</Badge>
                    <Badge variant="outline" className="text-[10px]">{s.symbol}</Badge>
                    {s.target_weight_pct != null && (
                      <Badge variant="outline" className="text-[10px]">→ {s.target_weight_pct.toFixed(1)}%</Badge>
                    )}
                    <Badge variant="outline" className={`text-[10px] ${s.priority === 'high' ? 'border-red-500/40 text-red-400' : s.priority === 'medium' ? 'border-amber-500/40 text-amber-400' : 'border-muted-foreground/30'}`}>
                      {s.priority}
                    </Badge>
                    <div className="text-xs text-foreground/90 flex-1">{s.rationale}</div>
                  </div>
                ))}
              </div>

              {optimization.rebalanced_allocation && optimization.rebalanced_allocation.length > 0 && (
                <div>
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-1">Rebalance Targets</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={optimization.rebalanced_allocation}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="symbol" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="current_weight_pct" name="Current %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target_weight_pct" name="Target %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Holding */}
      <Card>
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4 text-emerald-400" /> Add Holding</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div><Label className="text-xs">Symbol</Label><Input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="AAPL" /></div>
            <div><Label className="text-xs">Shares</Label><Input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="100" /></div>
            <div><Label className="text-xs">Avg Price</Label><Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="150.00" /></div>
            <div><Label className="text-xs">Sector</Label><Input value={sector} onChange={e => setSector(e.target.value)} placeholder="Technology" /></div>
            <div className="flex items-end"><Button onClick={addHolding} disabled={loading} className="w-full">Add</Button></div>
          </div>
          {!user && <div className="text-xs text-amber-400 mt-2">Sign in to save holdings to your account.</div>}
        </CardContent>
      </Card>

      {/* Holdings table */}
      <Card>
        <CardHeader className="py-2 px-3"><CardTitle className="text-sm">Holdings</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3">
          {enriched.length === 0 ? (
            <div className="text-xs text-muted-foreground py-6 text-center">No holdings yet — add one above.</div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 px-2 py-1 text-[10px] uppercase text-muted-foreground border-b border-border">
                <div className="col-span-2">Symbol</div>
                <div className="col-span-1 text-right">Shares</div>
                <div className="col-span-2 text-right">Avg Price</div>
                <div className="col-span-2 text-right">Current</div>
                <div className="col-span-2 text-right">Value</div>
                <div className="col-span-2 text-right">P/L</div>
                <div className="col-span-1" />
              </div>
              {enriched.map(p => (
                <div key={p.id} className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded hover:bg-muted/30 text-sm">
                  <div className="col-span-2 font-semibold flex items-center gap-2">
                    {p.symbol}
                    {p.sector && <Badge variant="outline" className="text-[9px]">{p.sector}</Badge>}
                  </div>
                  <div className="col-span-1 text-right tabular-nums">{p.shares}</div>
                  <div className="col-span-2 text-right tabular-nums">${p.avg_price.toFixed(2)}</div>
                  <div className="col-span-2 text-right tabular-nums">${p.currentPrice.toFixed(2)}</div>
                  <div className="col-span-2 text-right tabular-nums">${p.value.toFixed(2)}</div>
                  <div className={`col-span-2 text-right tabular-nums ${p.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {p.pl >= 0 ? '+' : ''}${p.pl.toFixed(2)} <span className="text-[10px]">({p.plPct.toFixed(1)}%)</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeHolding(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
