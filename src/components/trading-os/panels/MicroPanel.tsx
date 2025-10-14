import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MicroPanelProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MicroPanel({ title, value, change, icon, className, trend = 'neutral' }: MicroPanelProps) {
  const trendColor = trend === 'up' 
    ? 'text-[hsl(var(--terminal-green))]' 
    : trend === 'down' 
    ? 'text-[hsl(var(--terminal-red))]' 
    : 'text-[hsl(var(--terminal-blue))]';

  return (
    <Card className={cn(
      "p-2 bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))] hover:border-[hsl(var(--terminal-blue))]/50 transition-all",
      "min-w-[120px] min-h-[80px]",
      className
    )}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
            {title}
          </span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="space-y-0.5">
          <div className={cn("text-lg font-bold font-mono", trendColor)}>
            {value}
          </div>
          {change !== undefined && (
            <div className={cn("text-xs font-mono", trendColor)}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
