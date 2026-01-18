import React from 'react';
import { Sidebar } from './Sidebar';
import { ThreeScene } from './ThreeScene';
import { ActionPanel } from './ActionPanel';

export const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden">
      <Sidebar />

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col bg-background-dark overflow-hidden">

        {/* 3D Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden perspective-container">

          <ThreeScene />

          {/* Preview Label Overlay */}
          <div className="absolute top-8 left-8 bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 pointer-events-none select-none z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
            </span>
            <span className="text-xs font-bold tracking-wide text-white uppercase">Live Preview</span>
          </div>
        </div>

        <ActionPanel />

      </main>
    </div>
  );
};
