import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, TrendingDown, Activity, X } from 'lucide-react';

export function PaperTradingPanel() {
  const [trades, setTrades] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    loadTrades();
    loadExecutions();
    
    const interval = setInterval(loadTrades, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTrades = async () => {
    const { data } = await supabase
      .from('paper_trades')
      .select('*')
      .order('entry_time', { ascending: false })
      .limit(20);

    setTrades(data || []);

    if (data) {
      const openTrades = data.filter(t => t.status === 'open');
      const closedTrades = data.filter(t => t.status === 'closed');
      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winRate = closedTrades.length > 0
        ? (closedTrades.filter(t => (t.pnl || 0) > 0).length / closedTrades.length) * 100
        : 0;

      setMetrics({
        open_positions: openTrades.length,
        total_pnl: totalPnL,
        win_rate: winRate,
        total_trades: data.length,
      });
    }
  };

  const loadExecutions = async () => {
    const { data } = await supabase
      .from('strategy_executions')
      .select('*, trading_strategies(strategy_name)')
      .eq('status', 'running')
      .order('started_at', { ascending: false });

    setExecutions(data || []);
  };

  const closeTrade = async (tradeId: string) => {
    try {
      const trade = trades.find(t => t.id === tradeId);
      if (!trade) return;

      const mockCurrentPrice = trade.entry_price * (1 + (Math.random() - 0.5) * 0.05);
      const pnl = trade.trade_type === 'long'
        ? (mockCurrentPrice - trade.entry_price) * trade.quantity
        : (trade.entry_price - mockCurrentPrice) * trade.quantity;

      const { error } = await supabase
        .from('paper_trades')
        .update({
          status: 'closed',
          exit_price: mockCurrentPrice,
          exit_time: new Date().toISOString(),
          pnl,
          pnl_percent: (pnl / (trade.entry_price * trade.quantity)) * 100,
          exit_reason: 'Manual close',
        })
        .eq('id', tradeId);

      if (error) throw error;

      toast.success('Trade closed successfully');
      loadTrades();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const MetricCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="p-3 border-border bg-card">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Paper Trading</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <MetricCard
            icon={Activity}
            label="Open Positions"
            value={metrics.open_positions || 0}
            color="text-primary"
          />
          <MetricCard
            icon={DollarSign}
            label="Total P&L"
            value={`$${(metrics.total_pnl || 0).toFixed(2)}`}
            color={metrics.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}
          />
          <MetricCard
            icon={TrendingUp}
            label="Win Rate"
            value={`${(metrics.win_rate || 0).toFixed(1)}%`}
            color="text-primary"
          />
          <MetricCard
            icon={Activity}
            label="Total Trades"
            value={metrics.total_trades || 0}
            color="text-primary"
          />
        </div>

        {executions.length > 0 && (
          <Card className="p-3 border-border bg-card/50">
            <p className="text-xs text-muted-foreground mb-2">Active Strategies</p>
            <div className="space-y-1">
              {executions.map((exec) => (
                <div key={exec.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{exec.trading_strategies?.strategy_name}</span>
                  <Badge variant="default" className="text-xs">Running</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {trades.map((trade) => (
            <Card key={trade.id} className="p-3 border-border bg-card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{trade.symbol}</span>
                    <Badge variant={trade.trade_type === 'long' ? 'default' : 'secondary'} className="text-xs">
                      {trade.trade_type}
                    </Badge>
                    <Badge variant={trade.status === 'open' ? 'default' : 'outline'} className="text-xs">
                      {trade.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Entry: ${trade.entry_price?.toFixed(2)} × {trade.quantity}
                  </p>
                </div>
                <div className="text-right">
                  {trade.status === 'closed' ? (
                    <span className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                    </span>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => closeTrade(trade.id)}>
                      <X className="w-3 h-3 mr-1" />
                      Close
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">SL: </span>
                  <span className="text-foreground">${trade.stop_loss?.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">TP: </span>
                  <span className="text-foreground">${trade.take_profit?.toFixed(2)}</span>
                </div>
              </div>

              {trade.entry_reason && (
                <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
                  {trade.entry_reason}
                </p>
              )}
            </Card>
          ))}

          {trades.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No paper trades yet</p>
              <p className="text-sm">Start a strategy to begin trading</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
