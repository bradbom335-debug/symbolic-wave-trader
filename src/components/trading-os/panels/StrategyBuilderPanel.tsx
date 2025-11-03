import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Play, Pause, Save, TrendingUp, Target, Shield, Plus, X } from 'lucide-react';

export function StrategyBuilderPanel() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    strategy_name: '',
    description: '',
    strategy_type: 'momentum',
    timeframe: '5m',
    symbols: ['AAPL'],
    entry_rules: [] as any[],
    exit_rules: [] as any[],
    risk_rules: {
      stop_loss_percent: 2,
      take_profit_percent: 5,
      max_position_percent: 10,
    },
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    const { data, error } = await supabase
      .from('trading_strategies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load strategies');
      return;
    }

    setStrategies(data || []);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save strategies');
        return;
      }

      const strategyData = {
        ...formData,
        user_id: user.id,
        entry_rules: formData.entry_rules,
        exit_rules: formData.exit_rules,
        risk_rules: formData.risk_rules,
      };

      if (selectedStrategy) {
        const { error } = await supabase
          .from('trading_strategies')
          .update(strategyData)
          .eq('id', selectedStrategy.id);

        if (error) throw error;
        toast.success('Strategy updated successfully');
      } else {
        const { error } = await supabase
          .from('trading_strategies')
          .insert(strategyData);

        if (error) throw error;
        toast.success('Strategy created successfully');
      }

      loadStrategies();
      setIsCreating(false);
      setSelectedStrategy(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExecute = async (strategyId: string, action: 'start' | 'stop') => {
    try {
      const { data, error } = await supabase.functions.invoke('strategy-executor', {
        body: {
          strategy_id: strategyId,
          action,
          execution_mode: 'paper',
        },
      });

      if (error) throw error;
      toast.success(data.message);
      loadStrategies();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addEntryRule = () => {
    setFormData({
      ...formData,
      entry_rules: [
        ...formData.entry_rules,
        { type: 'price_above_ma', params: { period: 20 } },
      ],
    });
  };

  const removeEntryRule = (index: number) => {
    setFormData({
      ...formData,
      entry_rules: formData.entry_rules.filter((_, i) => i !== index),
    });
  };

  if (isCreating || selectedStrategy) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedStrategy ? 'Edit Strategy' : 'Create Strategy'}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => {
            setIsCreating(false);
            setSelectedStrategy(null);
          }}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <Label>Strategy Name</Label>
            <Input
              value={formData.strategy_name}
              onChange={(e) => setFormData({ ...formData, strategy_name: e.target.value })}
              placeholder="My Trading Strategy"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your strategy..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Strategy Type</Label>
              <Select
                value={formData.strategy_type}
                onValueChange={(value) => setFormData({ ...formData, strategy_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                  <SelectItem value="arbitrage">Arbitrage</SelectItem>
                  <SelectItem value="ml_based">ML Based</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeframe</Label>
              <Select
                value={formData.timeframe}
                onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="p-4 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <Label>Entry Rules</Label>
              </div>
              <Button size="sm" onClick={addEntryRule}>
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </div>

            {formData.entry_rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-background rounded">
                <Select
                  value={rule.type}
                  onValueChange={(value) => {
                    const newRules = [...formData.entry_rules];
                    newRules[index].type = value;
                    setFormData({ ...formData, entry_rules: newRules });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_above_ma">Price Above MA</SelectItem>
                    <SelectItem value="rsi_oversold">RSI Oversold</SelectItem>
                    <SelectItem value="rsi_overbought">RSI Overbought</SelectItem>
                    <SelectItem value="volume_surge">Volume Surge</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={() => removeEntryRule(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </Card>

          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <Label>Risk Management</Label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Stop Loss %</Label>
                <Input
                  type="number"
                  value={formData.risk_rules.stop_loss_percent}
                  onChange={(e) => setFormData({
                    ...formData,
                    risk_rules: { ...formData.risk_rules, stop_loss_percent: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Take Profit %</Label>
                <Input
                  type="number"
                  value={formData.risk_rules.take_profit_percent}
                  onChange={(e) => setFormData({
                    ...formData,
                    risk_rules: { ...formData.risk_rules, take_profit_percent: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Max Position %</Label>
                <Input
                  type="number"
                  value={formData.risk_rules.max_position_percent}
                  onChange={(e) => setFormData({
                    ...formData,
                    risk_rules: { ...formData.risk_rules, max_position_percent: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="p-4 border-t border-border">
          <Button className="w-full" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Strategy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Strategy Builder</h3>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Strategy
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-4 border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">{strategy.strategy_name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
              </div>
              <Badge variant={strategy.is_active ? 'default' : 'secondary'}>
                {strategy.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span className="capitalize">{strategy.strategy_type}</span>
              <span>•</span>
              <span>{strategy.timeframe}</span>
              <span>•</span>
              <span>{strategy.symbols?.length || 0} symbols</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={strategy.is_active ? 'destructive' : 'default'}
                onClick={() => handleExecute(strategy.id, strategy.is_active ? 'stop' : 'start')}
              >
                {strategy.is_active ? (
                  <><Pause className="w-3 h-3 mr-1" /> Stop</>
                ) : (
                  <><Play className="w-3 h-3 mr-1" /> Start Paper</>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedStrategy(strategy)}>
                Edit
              </Button>
            </div>
          </Card>
        ))}

        {strategies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No strategies yet</p>
            <p className="text-sm">Create your first trading strategy</p>
          </div>
        )}
      </div>
    </div>
  );
}
