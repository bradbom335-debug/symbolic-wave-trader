import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export const AIMemoryDashboard: React.FC = () => {
  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">AI Memory</h3>
        <div className="flex items-center gap-1">
          <Brain className="h-3 w-3 text-[hsl(var(--terminal-blue))]" />
          <span className="text-[9px] font-mono text-[hsl(var(--terminal-blue))]">SYNCED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1.5 rounded">
            <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-1">Contexts</div>
            <div className="text-[14px] font-mono font-bold text-foreground">1,247</div>
          </div>
          <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1.5 rounded">
            <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-1">Compression</div>
            <div className="text-[14px] font-mono font-bold text-[hsl(var(--terminal-green))]">72%</div>
          </div>
          <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1.5 rounded">
            <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-1">Latency</div>
            <div className="text-[14px] font-mono font-bold text-[hsl(var(--terminal-yellow))]">45ms</div>
          </div>
          <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1.5 rounded">
            <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-1">Coherence</div>
            <div className="text-[14px] font-mono font-bold text-[hsl(var(--terminal-blue))]">89%</div>
          </div>
        </div>
      </div>
    </Card>
  );
};