import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import {
  User, Bell, Shield, Palette, Brain, Key, Save, Layout, Trash2, Check,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { setLiveFeedInterval } from '@/hooks/useLivePrices';

interface AppSettings {
  default_symbol: string;
  default_timeframe: string;
  theme: string;
  refresh_interval_ms: number;
  risk_tolerance: string;
  goals: string;
}

interface DashboardLayout {
  id: string;
  name: string;
  is_default: boolean;
  panels: any[];
}

const DEFAULT_SETTINGS: AppSettings = {
  default_symbol: 'AAPL',
  default_timeframe: '1d',
  theme: 'neural-dark',
  refresh_interval_ms: 5000,
  risk_tolerance: 'moderate',
  goals: 'Long-term capital growth',
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [newLayoutName, setNewLayoutName] = useState('');

  const loadSettings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_app_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (data) {
      setSettings({
        default_symbol: data.default_symbol,
        default_timeframe: data.default_timeframe,
        theme: data.theme,
        refresh_interval_ms: data.refresh_interval_ms,
        risk_tolerance: data.risk_tolerance,
        goals: data.goals || '',
      });
      setLiveFeedInterval(data.refresh_interval_ms);
    }
  };

  const loadLayouts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .order('updated_at', { ascending: false });
    setLayouts((data || []) as DashboardLayout[]);
  };

  useEffect(() => { loadSettings(); loadLayouts(); /* eslint-disable-next-line */ }, [user?.id]);

  const saveSettings = async () => {
    if (!user) { toast.error('Sign in to save'); return; }
    setLoading(true);
    const { error } = await supabase
      .from('user_app_settings')
      .upsert({ user_id: user.id, ...settings }, { onConflict: 'user_id' });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setLiveFeedInterval(settings.refresh_interval_ms);
    toast.success('Settings saved');
  };

  const saveLayout = async () => {
    if (!user) { toast.error('Sign in'); return; }
    if (!newLayoutName.trim()) { toast.error('Name required'); return; }
    const snapshot = localStorage.getItem('trading-os-workspace') || '{}';
    const panels = JSON.parse(snapshot);
    const { error } = await supabase.from('dashboard_layouts').insert({
      user_id: user.id,
      name: newLayoutName.trim(),
      panels,
    });
    if (error) { toast.error(error.message); return; }
    setNewLayoutName('');
    toast.success('Layout saved');
    loadLayouts();
  };

  const applyLayout = (l: DashboardLayout) => {
    localStorage.setItem('trading-os-workspace', JSON.stringify(l.panels));
    toast.success(`Applied "${l.name}". Reloading…`);
    setTimeout(() => window.location.reload(), 600);
  };

  const setDefaultLayout = async (l: DashboardLayout) => {
    if (!user) return;
    await supabase.from('dashboard_layouts').update({ is_default: false }).eq('user_id', user.id);
    const { error } = await supabase.from('dashboard_layouts').update({ is_default: true }).eq('id', l.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`"${l.name}" set as default`);
    loadLayouts();
  };

  const deleteLayout = async (id: string) => {
    const { error } = await supabase.from('dashboard_layouts').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    loadLayouts();
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        {user && <Badge variant="outline" className="border-primary text-primary">{user.email}</Badge>}
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" /> Trading Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Default Symbol</Label>
                  <Input value={settings.default_symbol} onChange={e => setSettings({ ...settings, default_symbol: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Default Timeframe</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={settings.default_timeframe}
                    onChange={e => setSettings({ ...settings, default_timeframe: e.target.value })}>
                    {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Live Refresh Interval</Label>
                  <span className="text-xs text-muted-foreground">{(settings.refresh_interval_ms / 1000).toFixed(1)}s</span>
                </div>
                <Slider min={500} max={30000} step={500} value={[settings.refresh_interval_ms]}
                  onValueChange={v => setSettings({ ...settings, refresh_interval_ms: v[0] })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Risk Tolerance</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={settings.risk_tolerance}
                    onChange={e => setSettings({ ...settings, risk_tolerance: e.target.value })}>
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Goals</Label>
                  <Input value={settings.goals} onChange={e => setSettings({ ...settings, goals: e.target.value })} placeholder="Long-term growth…" />
                </div>
              </div>
              <Button onClick={saveSettings} disabled={loading}><Save className="h-4 w-4 mr-1" /> {loading ? 'Saving…' : 'Save Preferences'}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layouts" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Layout className="h-4 w-4" /> Dashboard Layouts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Layout name (e.g., Day Trading)" value={newLayoutName} onChange={e => setNewLayoutName(e.target.value)} />
                <Button onClick={saveLayout}>Save Current</Button>
              </div>
              {layouts.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center">No saved layouts yet.</div>
              ) : (
                <div className="space-y-2">
                  {layouts.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-2 border border-border rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{l.name}</span>
                        {l.is_default && <Badge variant="outline" className="text-[10px] border-primary text-primary">DEFAULT</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => applyLayout(l)}>Apply</Button>
                        <Button size="sm" variant="ghost" onClick={() => setDefaultLayout(l)}><Check className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteLayout(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Brain className="h-4 w-4 text-primary" /> AI</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                ['Auto Analysis', 'Re-run AI analysis on symbol change'],
                ['Pattern Detection', 'Detect chart patterns automatically'],
                ['Sentiment Tracking', 'Score news + social sentiment'],
                ['Aggressive Signals', 'Show short-horizon high-risk signals'],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Theme</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['neural-dark', 'quantum-wave', 'cognition'].map(t => (
                    <button key={t} onClick={() => setSettings({ ...settings, theme: t })}
                      className={`p-3 border rounded-lg text-center text-sm capitalize ${settings.theme === t ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                      <div className="w-full h-16 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded mb-2" />
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={saveSettings}>Save Theme</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" /> Account</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div>
                  <div className="font-medium text-sm">{user?.email || 'Not signed in'}</div>
                  <div className="text-xs text-muted-foreground">Lovable Cloud account</div>
                </div>
                {user && <Button variant="destructive" size="sm" onClick={() => signOut()}>Sign Out</Button>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
