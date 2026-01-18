/// <reference types="vite/client" />
import React, { useState } from 'react';
import { useCardStore } from '../store';
import { Sidebar } from './Sidebar';
import { ThreeScene } from './ThreeScene';
import { ActionPanel } from './ActionPanel';

export const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    name,
    email,
    jobTitle,
    school,
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

  const handleGenerateJson = async () => {
    const CARD_WIDTH = 85;
    const CARD_HEIGHT = 54;
    const CARD_THICKNESS = 1.6;
    const EDGE_PADDING = 6;

    const xLeft = -CARD_WIDTH / 2 + EDGE_PADDING;
    const yTop = CARD_HEIGHT / 2 - EDGE_PADDING;

    const positions = {
      name: { x: xLeft, y: yTop },
      jobTitle: { x: xLeft, y: yTop - 8 },
      school: { x: xLeft, y: yTop - 14 },
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
        school,
        phoneNumber,
        github: showGithub ? github : null,
        linkedin: showLinkedin ? linkedin : null,
        qrUrl: showQrCode && qrCodeLink ? qrCodeLink : "https://example.com"
      },
      positions
    };

    setIsGenerating(true);

    try {
      // Use VITE_API_URL from environment variables
      let apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("VITE_API_URL is not defined");
        alert("Configuration Error: API URL not found. Please check environment variables.");
        return;
      }

      // Robustly construct the URL: ensure it ends with /generate
      // This handles both cases: whether the env var has it or not.
      if (!apiUrl.endsWith('/generate')) {
        // distinct handling if apiUrl ends in / to avoid double slashes
        apiUrl = apiUrl.endsWith('/') ? `${apiUrl}generate` : `${apiUrl}/generate`;
      }

      console.log(`Attempting 3MF generation at: ${apiUrl}`);
      console.log('Payload:', payload);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Server Response Status:', response.status);
        console.error('Server Response Text:', response.statusText);
        // Try to get error details from body if JSON
        try {
          const errorBody = await response.text();
          console.error('Error Body:', errorBody);
        } catch (e) { /* ignore */ }

        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(name || 'card').replace(/\s+/g, '_')}.3mf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("3MF Generation Error:", error);
      // More informative user alert
      alert(`Generation Failed.\n\nDetails: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck console for full logs.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden">

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-primary/20 flex flex-col items-center text-center space-y-6 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <div className="relative size-20 bg-surface-dark rounded-full flex items-center justify-center border border-white/10 shadow-inner group">
                <span className="material-symbols-outlined text-4xl text-primary animate-[spin_3s_linear_infinite] drop-shadow-[0_0_15px_rgba(120,78,151,0.8)]">settings</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Generating 3D Model</h3>
              <p className="text-white/60 text-sm leading-relaxed px-4">
                The download will begin automatically. Please wait up to 30 seconds while the 3MF file validates and generates.
              </p>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative">
              {/* Fake progress bar: fills to 90% over 15s */}
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent-teal to-primary w-full origin-left animate-[progress_15s_ease-out_forwards]" />
            </div>
          </div>
        </div>
      )}

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

        <ActionPanel onGenerate={handleGenerateJson} isGenerating={isGenerating} />

      </main>
    </div>
  );
};
