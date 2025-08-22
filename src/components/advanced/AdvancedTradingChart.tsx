import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, BarChart3, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface PriceData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi: number;
  macd: number;
  sma20: number;
  sma50: number;
  bollinger_upper: number;
  bollinger_lower: number;
  neural_signal: number;
  quantum_probability: number;
}

const generateAdvancedData = (): PriceData[] => {
  const data: PriceData[] = [];
  let basePrice = 175;
  
  for (let i = 0; i < 100; i++) {
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.max(basePrice + change, 100);
    
    const high = newPrice * (1 + Math.random() * 0.02);
    const low = newPrice * (1 - Math.random() * 0.02);
    const open = i === 0 ? basePrice : data[i-1].close;
    
    data.push({
      timestamp: new Date(Date.now() - (99-i) * 60000).toISOString(),
      open,
      high,
      low,
      close: newPrice,
      volume: Math.random() * 1000000 + 500000,
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 5,
      sma20: newPrice * (0.98 + Math.random() * 0.04),
      sma50: newPrice * (0.96 + Math.random() * 0.08),
      bollinger_upper: newPrice * 1.02,
      bollinger_lower: newPrice * 0.98,
      neural_signal: Math.random(),
      quantum_probability: 0.3 + Math.random() * 0.4
    });
    
    basePrice = newPrice;
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-4 shadow-neural">
        <p className="text-sm text-muted-foreground mb-2">{new Date(label).toLocaleString()}</p>
        <div className="space-y-1">
          <p className="text-sm"><span className="text-muted-foreground">Price:</span> <span className="font-mono text-foreground">${data.close.toFixed(2)}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">Volume:</span> <span className="font-mono text-temporal">{(data.volume/1000000).toFixed(2)}M</span></p>
          <p className="text-sm"><span className="text-muted-foreground">RSI:</span> <span className="font-mono text-resonance">{data.rsi.toFixed(1)}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">Neural:</span> <span className="font-mono text-primary">{data.neural_signal.toFixed(3)}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">Quantum:</span> <span className="font-mono text-entropy">{data.quantum_probability.toFixed(3)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const AdvancedTradingChart = () => {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  const [showIndicators, setShowIndicators] = useState(true);
  const [data] = useState(generateAdvancedData());

  const currentPrice = data[data.length - 1].close;
  const previousPrice = data[data.length - 2].close;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">AAPL Neural Analysis</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-3xl font-mono font-bold text-foreground">${currentPrice.toFixed(2)}</span>
              <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-resonance' : 'text-chaos'}`}>
                {priceChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span className="text-lg font-medium">
                  {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="5M">5M</SelectItem>
              <SelectItem value="15M">15M</SelectItem>
              <SelectItem value="1H">1H</SelectItem>
              <SelectItem value="4H">4H</SelectItem>
              <SelectItem value="1D">1D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="candlestick">Candlestick</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showIndicators ? "default" : "outline"}
            size="sm"
            onClick={() => setShowIndicators(!showIndicators)}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Indicators</span>
          </Button>

          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
              {showIndicators && (
                <>
                  <Line type="monotone" dataKey="sma20" stroke="hsl(var(--temporal))" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="sma50" stroke="hsl(var(--resonance))" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="bollinger_upper" stroke="hsl(var(--entropy))" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="bollinger_lower" stroke="hsl(var(--entropy))" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </>
              )}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.1)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              {/* Candlestick representation using multiple lines */}
              <Line type="monotone" dataKey="high" stroke="transparent" dot={false} />
              <Line type="monotone" dataKey="low" stroke="transparent" dot={false} />
              <Line type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Technical Indicators Panel */}
      {showIndicators && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">RSI (14)</div>
            <div className={`text-lg font-mono font-bold ${
              data[data.length - 1].rsi > 70 ? 'text-chaos' : 
              data[data.length - 1].rsi < 30 ? 'text-resonance' : 'text-temporal'
            }`}>
              {data[data.length - 1].rsi.toFixed(1)}
            </div>
            <div className="w-full bg-secondary rounded-full h-1 mt-2">
              <div 
                className={`h-full rounded-full ${
                  data[data.length - 1].rsi > 70 ? 'bg-chaos' : 
                  data[data.length - 1].rsi < 30 ? 'bg-resonance' : 'bg-temporal'
                }`}
                style={{ width: `${data[data.length - 1].rsi}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">MACD</div>
            <div className={`text-lg font-mono font-bold ${
              data[data.length - 1].macd > 0 ? 'text-resonance' : 'text-chaos'
            }`}>
              {data[data.length - 1].macd.toFixed(2)}
            </div>
            <div className="flex items-center mt-2">
              {data[data.length - 1].macd > 0 ? (
                <TrendingUp className="h-4 w-4 text-resonance" />
              ) : (
                <TrendingDown className="h-4 w-4 text-chaos" />
              )}
            </div>
          </div>

          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Neural Signal</div>
            <div className="text-lg font-mono font-bold text-primary">
              {data[data.length - 1].neural_signal.toFixed(3)}
            </div>
            <div className="flex items-center mt-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs ml-1 text-muted-foreground">Active</span>
            </div>
          </div>

          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Quantum Prob</div>
            <div className="text-lg font-mono font-bold text-entropy">
              {(data[data.length - 1].quantum_probability * 100).toFixed(1)}%
            </div>
            <div className="flex items-center mt-2">
              <Zap className="h-4 w-4 text-entropy" />
            </div>
          </div>
        </div>
      )}

      {/* Volume Chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(-20)}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 10 }}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              formatter={(value: number) => [(value/1000000).toFixed(2) + 'M', 'Volume']}
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Bar dataKey="volume" fill="hsl(var(--temporal) / 0.6)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};