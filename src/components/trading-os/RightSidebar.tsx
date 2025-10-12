import { Bot, Brain, BarChart3, Atom, Network, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AIChatPanel } from './panels/AIChatPanel';
import { AIMemoryPanel } from './panels/AIMemoryPanel';
import { useState } from 'react';

const sidebarItems = [
  { id: 'chat', label: 'AI Chat', icon: Bot, color: 'text-purple-400' },
  { id: 'memory', label: 'AI-MOS Memory', icon: Brain, color: 'text-pink-400' },
  { id: 'analytics', label: 'Multi-Agent Analytics', icon: BarChart3, color: 'text-blue-400' },
  { id: 'quantum', label: 'Quantum Simulator', icon: Atom, color: 'text-cyan-400' },
  { id: 'graph', label: 'Knowledge Graph', icon: Network, color: 'text-green-400' },
  { id: 'insights', label: 'Insight Generator', icon: Lightbulb, color: 'text-yellow-400' },
];

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function RightSidebar({ isOpen, onToggle }: RightSidebarProps) {
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
      case 'chat':
        return <AIChatPanel />;
      case 'memory':
        return <AIMemoryPanel />;
      default:
        return <div className="p-4 text-slate-400">Panel under construction</div>;
    }
  };

  return (
    <>
      {/* Icon Bar */}
      <div className="w-14 bg-slate-950 border-l border-slate-800 flex flex-col items-center py-4 gap-2">
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
                "w-10 h-10 p-0 relative group",
                active ? item.color : "text-slate-500 hover:text-white"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {active && (
                <div className={cn("absolute right-0 top-0 bottom-0 w-1 bg-current rounded-l")} />
              )}
              
              {/* Tooltip */}
              <div className="absolute right-14 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Drawer Panel */}
      <Sheet open={isOpen && activePanel !== null} onOpenChange={onToggle}>
        <SheetContent side="right" className="w-[500px] bg-slate-900 border-slate-800 p-0">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">
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
