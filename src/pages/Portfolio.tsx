import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface Position {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

const Portfolio = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');

  // Mock data for demonstration
  const mockPositions: Position[] = [
    {
      id: '1',
      symbol: 'AAPL',
      shares: 100,
      avgPrice: 150.00,
      currentPrice: 178.50,
      totalValue: 17850,
      gainLoss: 2850,
      gainLossPercent: 19.0
    },
    {
      id: '2',
      symbol: 'TSLA',
      shares: 50,
      avgPrice: 220.00,
      currentPrice: 185.75,
      totalValue: 9287.50,
      gainLoss: -1712.50,
      gainLossPercent: -15.57
    },
    {
      id: '3',
      symbol: 'NVDA',
      shares: 25,
      avgPrice: 450.00,
      currentPrice: 875.30,
      totalValue: 21882.50,
      gainLoss: 10632.50,
      gainLossPercent: 94.4
    },
    {
      id: '4',
      symbol: 'AMZN',
      shares: 75,
      avgPrice: 120.00,
      currentPrice: 145.20,
      totalValue: 10890,
      gainLoss: 1890,
      gainLossPercent: 21.0
    }
  ];

  const portfolioValue = mockPositions.reduce((sum, pos) => sum + pos.totalValue, 0);
  const totalGainLoss = mockPositions.reduce((sum, pos) => sum + pos.gainLoss, 0);
  const totalGainLossPercent = (totalGainLoss / (portfolioValue - totalGainLoss)) * 100;

  const pieData = mockPositions.map(pos => ({
    name: pos.symbol,
    value: pos.totalValue,
    color: pos.gainLoss >= 0 ? '#10b981' : '#ef4444'
  }));

  const performanceData = [
    { date: '2024-01', value: 45000 },
    { date: '2024-02', value: 47500 },
    { date: '2024-03', value: 52000 },
    { date: '2024-04', value: 49800 },
    { date: '2024-05', value: 55200 },
    { date: '2024-06', value: 59910 }
  ];

  const addPosition = async () => {
    if (!symbol || !shares || !price) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Here you would save to Supabase
      toast.success('Position added successfully');
      setSymbol('');
      setShares('');
      setPrice('');
    } catch (error) {
      toast.error('Failed to add position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Neural-optimized allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-resonance" />
            ) : (
              <TrendingDown className="h-4 w-4 text-chaos" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-resonance' : 'text-chaos'}`}>
              ${totalGainLoss.toLocaleString()}
            </div>
            <p className={`text-xs ${totalGainLoss >= 0 ? 'text-resonance' : 'text-chaos'}`}>
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              Active holdings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Score</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">92.4</div>
            <p className="text-xs text-muted-foreground">
              Quantum analysis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-temporal" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-resonance" />
            Add New Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                placeholder="100"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Avg Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addPosition} 
                disabled={loading}
                className="w-full bg-gradient-neural hover:bg-gradient-neural/90"
              >
                Add Position
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPositions.map((position) => (
              <div key={position.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-semibold text-lg">{position.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.shares} shares @ ${position.avgPrice}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">${position.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Current: ${position.currentPrice}
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge 
                    variant={position.gainLoss >= 0 ? "default" : "destructive"}
                    className={position.gainLoss >= 0 ? "bg-resonance/20 text-resonance" : "bg-chaos/20 text-chaos"}
                  >
                    {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toLocaleString()}
                  </Badge>
                  <div className={`text-sm ${position.gainLoss >= 0 ? 'text-resonance' : 'text-chaos'}`}>
                    {position.gainLossPercent >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;