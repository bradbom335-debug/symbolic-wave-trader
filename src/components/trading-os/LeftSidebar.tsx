import { Newspaper, AlertTriangle, Search, BookOpen, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { NewsPanel } from './panels/NewsPanel';
import { AlertsPanel } from './panels/AlertsPanel';
import { useState } from 'react';

const sidebarItems = [
  { id: 'news', label: 'Market News', icon: Newspaper, color: 'text-blue-400' },
  { id: 'alerts', label: 'Alerts & Warnings', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'scanner', label: 'Asset Scanner', icon: Search, color: 'text-green-400' },
  { id: 'journal', label: 'Trading Journal', icon: BookOpen, color: 'text-purple-400' },
  { id: 'patterns', label: 'Pattern Recognition', icon: Target, color: 'text-orange-400' },
  { id: 'knowledge', label: 'Knowledge Base', icon: TrendingUp, color: 'text-cyan-400' },
];

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function LeftSidebar({ isOpen, onToggle }: LeftSidebarProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleItemClick = (id: string) => {
    if (activePanel === id) {
      setActivePanel(null);
      onToggle();
    } else {
      setActivePanel(id);
      if (!isOpen) {
        onToggle();
      }
    }
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'news':
        return <NewsPanel />;
      case 'alerts':
        return <AlertsPanel />;
      default:
        return <div className="p-4 text-slate-400">Panel under construction</div>;
    }
  };

  return (
    <>
      {/* Icon Bar - Compact */}
      <div className="w-10 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-2 gap-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = activePanel === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-8 h-8 p-0 relative group",
                active ? item.color : "text-slate-500 hover:text-white"
              )}
              title={item.label}
            >
              <Icon className="w-3.5 h-3.5" />
              {active && (
                <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 bg-current rounded-r")} />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-10 px-1.5 py-0.5 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Drawer Panel - Compact */}
      <Sheet open={isOpen && activePanel !== null} onOpenChange={onToggle}>
        <SheetContent side="left" className="w-72 bg-slate-900 border-slate-800 p-0">
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">
                {sidebarItems.find(item => item.id === activePanel)?.label}
              </h2>
            </div>
            <div className="flex-1 overflow-auto">
              {renderPanelContent()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
