import { useState } from 'react';
import { TopCommandBar } from './TopCommandBar';
import { BottomStatusBar } from './BottomStatusBar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { PanelWorkspace } from './PanelWorkspace';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export function TradingOS() {
  const { leftDrawerOpen, rightDrawerOpen, toggleLeftDrawer, toggleRightDrawer } = useWorkspaceStore();

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Top Command Bar */}
      <TopCommandBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Icon Bar */}
        <LeftSidebar isOpen={leftDrawerOpen} onToggle={toggleLeftDrawer} />
        
        {/* Central Panel Workspace */}
        <PanelWorkspace />
        
        {/* Right Icon Bar */}
        <RightSidebar isOpen={rightDrawerOpen} onToggle={toggleRightDrawer} />
      </div>
      
      {/* Bottom Status Bar */}
      <BottomStatusBar />
    </div>
  );
}
