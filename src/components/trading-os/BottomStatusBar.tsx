import { Activity, TrendingUp, Zap, HardDrive, Cpu, ChevronUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export function BottomStatusBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="h-6 bg-slate-950 border-t border-slate-800/50 flex items-center px-2 text-[10px] font-mono relative overflow-hidden">
        {/* Scanline */}
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        {/* Left Section - Connection Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-400">LIVE</span>
          </div>
          
          <div className="h-3 w-px bg-slate-700" />
          
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-2.5 h-2.5" />
            <span>12ms</span>
          </div>
        </div>

        {/* Center Section - Quick Actions */}
        <div className="flex-1 flex items-center justify-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-2 text-[10px] bg-green-500/10 text-green-400 hover:bg-green-500/20"
          >
            <TrendingUp className="w-2.5 h-2.5 mr-1" />
            BUY
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20"
          >
            <TrendingUp className="w-2.5 h-2.5 mr-1 rotate-180" />
            SELL
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="h-5 px-2 text-[10px] text-slate-400 hover:text-cyan-400 gap-1"
          >
            <DollarSign className="w-2.5 h-2.5" />
            Portfolio
            <ChevronUp className="w-2 h-2" />
          </Button>
        </div>

        {/* Right Section - System Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-2.5 h-2.5" />
            <span>12%</span>
          </div>
          
          <div className="h-3 w-px bg-slate-700" />
          
          <div className="flex items-center gap-1 text-slate-400">
            <HardDrive className="w-2.5 h-2.5" />
            <span>284MB</span>
          </div>
          
          <div className="h-3 w-px bg-slate-700" />
          
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[9px] h-4 px-1.5">
            <Zap className="w-2 h-2 mr-0.5" />
            OPTIMAL
          </Badge>
        </div>
      </div>

      {/* Portfolio Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="h-64 bg-slate-950 border-slate-800 p-0">
          <div className="h-full flex flex-col">
            <div className="px-3 py-2 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Portfolio Overview</h2>
            </div>
            
            <div className="flex-1 overflow-auto p-3">
              <div className="grid grid-cols-8 gap-2">
                {[...Array(16)].map((_, i) => (
                  <Card key={i} className="p-2 bg-slate-900/50 border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">Asset {i + 1}</div>
                    <div className="text-xs font-bold text-white">$1.2K</div>
                    <div className="text-[9px] text-green-400">+5.2%</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
