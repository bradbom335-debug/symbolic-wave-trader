import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MultiChartPanelProps {
  symbol: string;
}

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

export function MultiChartPanel({ symbol }: MultiChartPanelProps) {
  const [selectedTimeframes, setSelectedTimeframes] = useState<typeof TIMEFRAMES[number][]>(['5m', '1h', '1d']);

  return (
    <Card className="p-4 bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-semibold text-[hsl(var(--terminal-blue))]">
            Multi-Timeframe Analysis
          </h3>
          <Tabs defaultValue="3" className="w-auto">
            <TabsList className="h-7 bg-[hsl(var(--terminal-bg-deep))]">
              <TabsTrigger value="2" className="text-xs h-6 px-2" onClick={() => setSelectedTimeframes(['5m', '1h'])}>
                2x
              </TabsTrigger>
              <TabsTrigger value="3" className="text-xs h-6 px-2" onClick={() => setSelectedTimeframes(['5m', '1h', '1d'])}>
                3x
              </TabsTrigger>
              <TabsTrigger value="4" className="text-xs h-6 px-2" onClick={() => setSelectedTimeframes(['1m', '5m', '1h', '1d'])}>
                4x
              </TabsTrigger>
              <TabsTrigger value="6" className="text-xs h-6 px-2" onClick={() => setSelectedTimeframes(TIMEFRAMES as any)}>
                6x
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className={`grid gap-2 ${
          selectedTimeframes.length === 2 ? 'grid-cols-2' :
          selectedTimeframes.length === 3 ? 'grid-cols-3' :
          selectedTimeframes.length === 4 ? 'grid-cols-2 grid-rows-2' :
          'grid-cols-3 grid-rows-2'
        }`}>
          {selectedTimeframes.map((timeframe) => {
            // Generate mock data for the chart
            const data = Array.from({ length: 20 }, (_, i) => ({
              time: i,
              price: 100 + Math.random() * 20,
            }));

            return (
              <div key={timeframe} className="min-h-[150px] bg-[hsl(var(--terminal-bg-deep))] rounded border border-[hsl(var(--terminal-bg-elevated))] p-2">
                <div className="text-[10px] text-[hsl(var(--terminal-blue))] font-mono mb-1 uppercase tracking-wider">
                  {symbol} • {timeframe}
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--terminal-bg-panel))',
                        border: '1px solid hsl(var(--border))',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--terminal-blue))"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
