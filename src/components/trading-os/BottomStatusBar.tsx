import { Activity, TrendingUp, Zap, HardDrive, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export function BottomStatusBar() {
  const { toggleBottomDrawer, bottomDrawerOpen } = useWorkspaceStore();

  return (
    <div className="h-8 bg-slate-950 border-t border-slate-800 flex items-center px-4 text-xs">
      {/* Left Section - Connection Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-400">Market Data: Connected</span>
        </div>
        
        <div className="text-slate-600">|</div>
        
        <div className="flex items-center gap-1 text-slate-400">
          <Activity className="w-3 h-3" />
          <span>Latency: 12ms</span>
        </div>
      </div>

      {/* Center Section - Quick Actions */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-3 text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          New Position
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-3 text-xs bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
        >
          <Zap className="w-3 h-3 mr-1" />
          Create Alert
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBottomDrawer}
          className="h-6 px-3 text-xs text-slate-400 hover:text-white"
        >
          Advanced Tools
        </Button>
      </div>

      {/* Right Section - System Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-slate-400">
          <Cpu className="w-3 h-3" />
          <span>CPU: 12%</span>
        </div>
        
        <div className="text-slate-600">|</div>
        
        <div className="flex items-center gap-1 text-slate-400">
          <HardDrive className="w-3 h-3" />
          <span>Memory: 284 MB</span>
        </div>
        
        <div className="text-slate-600">|</div>
        
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] h-5">
          Performance: Optimal
        </Badge>
      </div>
    </div>
  );
}
