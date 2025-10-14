import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface VolumeProfilePanelProps {
  symbol: string;
  timeframe?: string;
}

export function VolumeProfilePanel({ symbol, timeframe = '1d' }: VolumeProfilePanelProps) {
  const { data: volumeProfile, isLoading } = useQuery({
    queryKey: ['volume-profile', symbol, timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('volume_profiles')
        .select('*')
        .eq('symbol', symbol)
        .eq('timeframe', timeframe)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-4 bg-[hsl(var(--terminal-bg-panel))]">
        <div className="text-sm text-muted-foreground">Loading volume profile...</div>
      </Card>
    );
  }

  if (!volumeProfile) {
    return (
      <Card className="p-4 bg-[hsl(var(--terminal-bg-panel))]">
        <div className="text-sm text-muted-foreground">No volume profile data available</div>
      </Card>
    );
  }

  const priceLevels = volumeProfile.price_levels as Array<{ price: number; volume: number }>;
  const poc = volumeProfile.poc;
  const val = volumeProfile.val;
  const vah = volumeProfile.vah;

  return (
    <Card className="p-4 bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-semibold text-[hsl(var(--terminal-blue))]">
            Volume Profile
          </h3>
          <div className="text-xs text-muted-foreground font-mono">{symbol} • {timeframe}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 bg-[hsl(var(--terminal-bg-deep))] rounded border border-[hsl(var(--terminal-bg-elevated))]">
            <div className="text-[10px] text-muted-foreground">VAH</div>
            <div className="text-[hsl(var(--terminal-green))] font-bold">${vah}</div>
          </div>
          <div className="p-2 bg-[hsl(var(--terminal-bg-deep))] rounded border border-[hsl(var(--terminal-blue))]/50">
            <div className="text-[10px] text-muted-foreground">POC</div>
            <div className="text-[hsl(var(--terminal-blue))] font-bold">${poc}</div>
          </div>
          <div className="p-2 bg-[hsl(var(--terminal-bg-deep))] rounded border border-[hsl(var(--terminal-bg-elevated))]">
            <div className="text-[10px] text-muted-foreground">VAL</div>
            <div className="text-[hsl(var(--terminal-red))] font-bold">${val}</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priceLevels} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="price"
              width={60}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--terminal-bg-elevated))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
              {priceLevels.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.price === poc
                      ? 'hsl(var(--terminal-blue))'
                      : entry.price >= (val || 0) && entry.price <= (vah || 0)
                      ? 'hsl(var(--terminal-green) / 0.6)'
                      : 'hsl(var(--muted-foreground) / 0.3)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
