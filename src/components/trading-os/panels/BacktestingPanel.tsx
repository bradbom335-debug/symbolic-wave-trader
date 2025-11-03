import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlayCircle, TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BacktestingPanel() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [backtests, setBacktests] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [selectedBacktest, setSelectedBacktest] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    symbol: 'AAPL',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    initial_capital: 10000,
  });

  useEffect(() => {
    loadStrategies();
    loadBacktests();
  }, []);

  const loadStrategies = async () => {
    const { data } = await supabase
      .from('trading_strategies')
      .select('*')
      .order('created_at', { ascending: false });

    setStrategies(data || []);
  };

  const loadBacktests = async () => {
    const { data } = await supabase
      .from('backtest_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setBacktests(data || []);
  };

  const runBacktest = async () => {
    if (!selectedStrategy) {
      toast.error('Please select a strategy');
      return;
    }

    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('backtesting-engine', {
        body: {
          strategy_id: selectedStrategy,
          ...config,
        },
      });

      if (error) throw error;

      toast.success('Backtest completed successfully!');
      setSelectedBacktest(data.results);
      loadBacktests();
    } catch (error: any) {
      toast.error(error.message || 'Backtest failed');
    } finally {
      setIsRunning(false);
    }
  };

  const MetricCard = ({ icon: Icon, label, value, change, positive }: any) => (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </p>
          )}
        </div>
        <Icon className="w-5 h-5 text-primary opacity-50" />
      </div>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Backtesting Engine</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Strategy</Label>
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.strategy_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Symbol</Label>
            <Input
              value={config.symbol}
              onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
              placeholder="AAPL"
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={config.start_date}
              onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={config.end_date}
              onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
            />
          </div>
        </div>

        <Button className="w-full mt-4" onClick={runBacktest} disabled={isRunning}>
          {isRunning ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running Backtest...</>
          ) : (
            <><PlayCircle className="w-4 h-4 mr-2" /> Run Backtest</>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {selectedBacktest && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                icon={DollarSign}
                label="Total Return"
                value={`${selectedBacktest.total_return?.toFixed(2)}%`}
                change={`$${(selectedBacktest.final_capital - config.initial_capital).toFixed(2)}`}
                positive={selectedBacktest.total_return > 0}
              />
              <MetricCard
                icon={Target}
                label="Win Rate"
                value={`${selectedBacktest.win_rate?.toFixed(1)}%`}
                change={`${selectedBacktest.winning_trades}/${selectedBacktest.total_trades} trades`}
                positive={selectedBacktest.win_rate > 50}
              />
              <MetricCard
                icon={BarChart3}
                label="Sharpe Ratio"
                value={selectedBacktest.sharpe_ratio?.toFixed(2)}
                positive={selectedBacktest.sharpe_ratio > 1}
              />
            </div>

            <Card className="p-4 border-border bg-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Equity Curve</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedBacktest.equity_curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Recent Trades</h4>
              <div className="space-y-2 max-h-64 overflow-auto">
                {selectedBacktest.trades_data?.slice(0, 10).map((trade: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-background rounded text-sm">
                    <div>
                      <span className="font-medium text-foreground">{trade.type}</span>
                      <span className="text-muted-foreground ml-2">@ ${trade.entry_price?.toFixed(2)}</span>
                    </div>
                    <span className={trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}>
                      ${trade.pnl?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!selectedBacktest && backtests.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Previous Backtests</h4>
            <div className="space-y-2">
              {backtests.map((bt) => (
                <Card 
                  key={bt.id} 
                  className="p-3 border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedBacktest(bt)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{bt.symbol}</p>
                      <p className="text-xs text-muted-foreground">{new Date(bt.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-sm font-semibold ${bt.total_return > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {bt.total_return?.toFixed(2)}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
