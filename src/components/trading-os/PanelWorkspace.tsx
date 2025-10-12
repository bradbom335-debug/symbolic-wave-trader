import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Outlet } from 'react-router-dom';

export function PanelWorkspace() {
  const { currentWorkspace, workspaces } = useWorkspaceStore();
  const workspace = workspaces.find(w => w.id === currentWorkspace);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <Outlet />
    </div>
  );
}
