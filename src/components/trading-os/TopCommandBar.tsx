import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Newspaper, 
  Bell,
  User,
  Wifi,
  Clock,
  ChevronDown,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedTradingLogo } from './AnimatedTradingLogo';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';

const navigationTabs = [
  { id: 'markets', label: 'Markets', icon: BarChart3, path: '/dashboard' },
  { id: 'analysis', label: 'Analysis', icon: TrendingUp, path: '/analysis' },
  { id: 'agents', label: 'AI Agents', icon: Bot, path: '/portfolio' },
];

export function TopCommandBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="h-9 bg-slate-950 border-b border-slate-800/50 flex items-center px-2 gap-2 relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        {/* Left Section - Logo & Time */}
        <div className="flex items-center gap-2">
          <AnimatedTradingLogo />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            TraderOS
          </span>
          
          <div className="h-4 w-px bg-slate-700 mx-1" />
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Clock className="w-2.5 h-2.5" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => navigate(tab.path)}
                className={cn(
                  "gap-1.5 relative px-2 h-6 text-[11px] font-medium transition-all",
                  active
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Analytics Drawer Trigger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          className="h-6 px-2 text-[10px] text-slate-400 hover:text-cyan-400 gap-1"
        >
          <Activity className="w-3 h-3" />
          Analytics
          <ChevronDown className="w-2.5 h-2.5" />
        </Button>

        {/* Right Section - Status & User */}
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-px bg-slate-700" />
          
          {/* Connection Status */}
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            <Wifi className="w-2.5 h-2.5 text-green-400" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-6 w-6 p-0 text-slate-400 hover:text-white">
            <Bell className="w-3 h-3" />
            <Badge className="absolute -top-0.5 -right-0.5 w-3 h-3 p-0 flex items-center justify-center text-[8px] bg-red-500 border-0">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
            <User className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Advanced Analytics Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="top" className="h-64 bg-slate-950 border-slate-800 p-0">
          <div className="h-full flex flex-col">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Advanced Analytics</h2>
              <Badge className="bg-cyan-500/10 text-cyan-400 text-[10px]">
                <Zap className="w-2 h-2 mr-1" />
                Real-time
              </Badge>
            </div>
            
            <div className="flex-1 overflow-auto p-3">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="p-2 bg-slate-900/50 border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">Metric {i + 1}</div>
                    <div className="text-sm font-bold text-white">1,234</div>
                    <div className="text-[9px] text-green-400">+12.5%</div>
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
