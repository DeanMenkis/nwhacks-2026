import React, { useState } from 'react';
import { useCardStore } from '../store';
import { Sidebar } from './Sidebar';
import { ThreeScene } from './ThreeScene';
import { ActionPanel } from './ActionPanel';

export const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const {
    name,
    email,
    jobTitle,
    phoneNumber,
    github,
    linkedin,
    showQrCode,
    showGithub,
    showLinkedin,
    qrCodeLink,
    color,
    fontColor,
    font,
    filletRadius,
  } = useCardStore();

  const handleGenerateJson = () => {
    const CARD_WIDTH = 85;
    const CARD_HEIGHT = 54;
    const CARD_THICKNESS = 1.6;
    const EDGE_PADDING = 6;

    const xLeft = -CARD_WIDTH / 2 + EDGE_PADDING;
    const yTop = CARD_HEIGHT / 2 - EDGE_PADDING;

    const positions = {
      name: { x: xLeft, y: yTop },
      jobTitle: { x: xLeft, y: yTop - 8 },
      phone: { x: xLeft, y: -CARD_HEIGHT / 2 + EDGE_PADDING },
      email: { x: xLeft, y: -CARD_HEIGHT / 2 + EDGE_PADDING + 6 },
      github: { x: xLeft, y: -CARD_HEIGHT / 2 + EDGE_PADDING + 12 },
      linkedin: { x: xLeft, y: -CARD_HEIGHT / 2 + EDGE_PADDING + 18 },
      qrCode: { x: 0, y: 0, face: 'back' }
    };

    const payload = {
      metadata: {
        version: "1.0",
        timestamp: new Date().toISOString(),
        appName: "PrintMyCard"
      },
      design: {
        color,
        font,
        fontColor,
        filletRadius,
        thickness: CARD_THICKNESS,
        dimensions: { width: CARD_WIDTH, height: CARD_HEIGHT }
      },
      content: {
        name,
        email,
        jobTitle,
        phoneNumber,
        github: showGithub ? github : null,
        linkedin: showLinkedin ? linkedin : null,
        qrUrl: showQrCode && qrCodeLink ? qrCodeLink : "https://example.com"
      },
      positions
    };

    console.log(JSON.stringify(payload, null, 2));
  };

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col bg-background-dark overflow-hidden">

        {/* Mobile Toggle Button */}
        <button
          className="absolute top-4 left-4 z-40 p-2 bg-surface-dark/90 backdrop-blur-md border border-white/10 rounded-xl text-white md:hidden hover:bg-surface-dark transition-colors shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* 3D Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden perspective-container">

          <ThreeScene />

          {/* Preview Label Overlay */}
          <div className="absolute top-8 right-8 md:left-8 md:right-auto bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 pointer-events-none select-none z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
            </span>
            <span className="text-xs font-bold tracking-wide text-white uppercase">Live Preview</span>
          </div>
        </div>

        <ActionPanel onGenerate={handleGenerateJson} />

      </main>
    </div>
  );
};
