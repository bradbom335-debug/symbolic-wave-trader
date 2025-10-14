import { useWorkspaceStore } from '@/stores/workspaceStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayoutDashboard, TrendingUp, Activity, Shield } from 'lucide-react';

const PRESET_ICONS = {
  day_trading: TrendingUp,
  swing_analysis: Activity,
  options_trading: LayoutDashboard,
  risk_management: Shield,
  custom: LayoutDashboard,
};

export function WorkspacePresetSelector() {
  const { workspaces, currentWorkspace } = useWorkspaceStore();
  const currentWs = workspaces.find(w => w.id === currentWorkspace);

  return (
    <Select defaultValue={currentWorkspace}>
      <SelectTrigger className="w-[180px] h-7 text-xs bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))] font-mono">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent className="bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
        {workspaces.map((workspace) => {
          const Icon = PRESET_ICONS[workspace.presetType || 'custom'];
          return (
            <SelectItem key={workspace.id} value={workspace.id} className="text-xs font-mono">
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3" />
                <span>{workspace.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
