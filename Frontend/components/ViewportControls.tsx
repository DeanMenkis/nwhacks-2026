import React from 'react';

export const ViewportControls: React.FC = () => {
  return (
    <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
      <div className="bg-surface-dark/90 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-xl flex flex-col gap-2">
        <ControlButton icon="3d_rotation" label="Rotate View" />
        <ControlButton icon="add" label="Zoom In" />
        <ControlButton icon="remove" label="Zoom Out" />
        <ControlButton icon="center_focus_strong" label="Reset Camera" />
      </div>
    </div>
  );
};

const ControlButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button
    aria-label={label}
    className="size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary/20 text-white/70 hover:text-primary transition-all hover:scale-105"
  >
    <span className="material-symbols-outlined">{icon}</span>
  </button>
);
