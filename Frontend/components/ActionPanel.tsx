import React from 'react';

interface ActionPanelProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onGenerate, isGenerating }) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40">
      <div className="bg-surface-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/50 flex items-center justify-between gap-6">
        {/* Status */}
        <div className="flex items-center gap-4 pl-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-2">
              <span className="text-accent-teal font-bold text-sm">Ready to Print</span>
              <span className="material-symbols-outlined text-accent-teal text-base">check_circle</span>
            </div>
          </div>


        </div>

        {/* Primary Action */}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`
            group relative overflow-hidden rounded-xl px-8 py-3 flex items-center gap-3 shadow-glow transition-all duration-200
            ${isGenerating
              ? 'bg-white/10 cursor-not-allowed text-white/50'
              : 'bg-primary hover:bg-primary-hover active:scale-95 text-white'
            }
          `}
        >
          {!isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          <span className="material-symbols-outlined">{isGenerating ? 'hourglass_top' : 'deployed_code'}</span>
          <span className="font-bold text-base tracking-wide whitespace-nowrap">
            {isGenerating ? 'Generating...' : 'Generate 3MF'}
          </span>
        </button>
      </div>
    </div>
  );
};
