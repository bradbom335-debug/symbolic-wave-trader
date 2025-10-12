import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Newspaper, 
  Settings, 
  Bell,
  User,
  Wifi,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const navigationTabs = [
  { id: 'markets', label: 'Markets', icon: BarChart3, path: '/dashboard' },
  { id: 'analysis', label: 'Analysis', icon: TrendingUp, path: '/analysis' },
  { id: 'agents', label: 'AI Agents', icon: Bot, path: '/portfolio' },
  { id: 'intelligence', label: 'Intelligence', icon: Newspaper, path: '/settings' },
];

export function TopCommandBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-6">
      {/* Left Section - Logo & Time */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TraderOS
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{time.toLocaleTimeString()}</span>
          <span className="text-slate-600">|</span>
          <span>{time.toLocaleDateString()}</span>
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
                "gap-2 relative px-4 h-9 text-sm transition-all",
                active
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Right Section - Status & User */}
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-green-400">Live</span>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative text-slate-400 hover:text-white">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-red-500 border-0">
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Settings className="w-4 h-4" />
        </Button>

        {/* User Profile */}
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
