import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Panel {
  id: string;
  type: 'micro' | 'small' | 'medium' | 'large' | 'fullscreen';
  component: string;
  title: string;
  icon: string;
  position: { x: number; y: number; w: number; h: number };
  pinned: boolean;
  stackGroup?: string;
  refreshInterval?: number;
  dataSource: string[];
}

export interface Workspace {
  id: string;
  name: string;
  panels: Panel[];
  layout: 'grid' | 'free' | 'stacked';
  presetType?: 'day_trading' | 'swing_analysis' | 'options_trading' | 'risk_management' | 'custom';
  linkedSymbol?: string;
  performanceMode?: 'high' | 'balanced' | 'battery';
}

interface WorkspaceState {
  currentWorkspace: string;
  workspaces: Workspace[];
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
  bottomDrawerOpen: boolean;
  
  // Actions
  setCurrentWorkspace: (id: string) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  
  toggleLeftDrawer: () => void;
  toggleRightDrawer: () => void;
  toggleBottomDrawer: () => void;
  
  addPanel: (workspaceId: string, panel: Panel) => void;
  updatePanel: (workspaceId: string, panelId: string, updates: Partial<Panel>) => void;
  removePanel: (workspaceId: string, panelId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      currentWorkspace: 'default',
      workspaces: [
        {
          id: 'default',
          name: 'Day Trading',
          panels: [],
          layout: 'grid',
          presetType: 'day_trading',
          performanceMode: 'high'
        }
      ],
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      bottomDrawerOpen: false,
      
      setCurrentWorkspace: (id) => set({ currentWorkspace: id }),
      
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace]
      })),
      
      updateWorkspace: (id, updates) => set((state) => ({
        workspaces: state.workspaces.map(w => 
          w.id === id ? { ...w, ...updates } : w
        )
      })),
      
      deleteWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter(w => w.id !== id)
      })),
      
      toggleLeftDrawer: () => set((state) => ({
        leftDrawerOpen: !state.leftDrawerOpen
      })),
      
      toggleRightDrawer: () => set((state) => ({
        rightDrawerOpen: !state.rightDrawerOpen
      })),
      
      toggleBottomDrawer: () => set((state) => ({
        bottomDrawerOpen: !state.bottomDrawerOpen
      })),
      
      addPanel: (workspaceId, panel) => set((state) => ({
        workspaces: state.workspaces.map(w =>
          w.id === workspaceId
            ? { ...w, panels: [...w.panels, panel] }
            : w
        )
      })),
      
      updatePanel: (workspaceId, panelId, updates) => set((state) => ({
        workspaces: state.workspaces.map(w =>
          w.id === workspaceId
            ? {
                ...w,
                panels: w.panels.map(p =>
                  p.id === panelId ? { ...p, ...updates } : p
                )
              }
            : w
        )
      })),
      
      removePanel: (workspaceId, panelId) => set((state) => ({
        workspaces: state.workspaces.map(w =>
          w.id === workspaceId
            ? { ...w, panels: w.panels.filter(p => p.id !== panelId) }
            : w
        )
      })),
    }),
    {
      name: 'trading-os-workspace',
    }
  )
);
