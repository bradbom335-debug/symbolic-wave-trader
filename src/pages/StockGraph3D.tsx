import { useState } from 'react';
import { MultiStockGraph3D } from '@/components/advanced/MultiStockGraph3D';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const StockGraph3D = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="h-full w-full p-2 flex flex-col gap-2">
      <Card className="flex items-center justify-between px-3 py-1.5 bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--terminal-accent))]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--terminal-text))]">
            3D Multi-Stock Visualization
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[hsl(var(--terminal-text-dim))]">
          <span>Selected:</span>
          {selected ? (
            <Badge className="bg-[hsl(var(--terminal-accent))] text-[hsl(var(--terminal-bg))]">{selected}</Badge>
          ) : (
            <span className="italic">none — hover and click a wave</span>
          )}
        </div>
      </Card>
      <div className="flex-1 min-h-0">
        <MultiStockGraph3D onSelectSymbol={setSelected} />
      </div>
    </div>
  );
};

export default StockGraph3D;
