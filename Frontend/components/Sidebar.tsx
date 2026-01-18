import React from 'react';
import { useCardStore } from '../store';
import { InputGroup } from './InputGroup';
import { FilamentColor } from '../types';

const COLORS: FilamentColor[] = [
  { hex: '#784e97', name: 'Purple' },
  { hex: '#8FD9D9', name: 'Teal' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#FF7597', name: 'Pink' },
  { hex: '#48434c', name: 'Charcoal' },
];

export const Sidebar: React.FC = () => {
  const { name, email, jobTitle, color, setName, setEmail, setJobTitle, setColor } = useCardStore();

  return (
    <aside className="w-[360px] h-full bg-surface-dark border-r border-white/5 flex flex-col z-20 shadow-2xl overflow-y-auto shrink-0 relative">
      {/* Header */}
      <div className="px-8 py-8 pb-4">
        <div className="flex items-center gap-3 text-white mb-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
            <span className="material-symbols-outlined text-xl">view_in_ar</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Print Studio</h1>
        </div>
        <p className="text-white/40 text-sm font-medium pl-11">Dashboard Preview v2.4</p>
      </div>

      <div className="w-full h-px bg-white/5 my-2 mx-8 !w-auto" />

      {/* Scrollable Content */}
      <div className="flex-1 px-4 py-4 space-y-6">

        {/* Maker Details */}
        <div className="px-4">
          <h3 className="text-white text-lg font-bold leading-tight">Maker Details</h3>
          <p className="text-white/40 text-sm mt-1">Configure your profile for this session.</p>
        </div>

        {/* Inputs - Modular implementation */}
        <InputGroup
          label="Name"
          icon="person"
          placeholder="Enter maker name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputGroup
          label="Email"
          icon="mail"
          type="email"
          placeholder="maker@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputGroup
          label="Job Title"
          icon="work"
          placeholder="Lead Designer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <div className="w-full h-px bg-white/5 my-2 mx-4 !w-auto" />

        {/* Filament Colors */}
        <div className="px-4">
          <h3 className="text-white text-lg font-bold leading-tight mb-4">Filament Colors</h3>
          <div className="grid grid-cols-5 gap-3">
            {COLORS.map((c) => {
              const isActive = color === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`
                    aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer 
                    ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#2A2534] shadow-glow scale-110' : 'opacity-80 hover:opacity-100 hover:scale-110'}
                  `}
                  style={{ backgroundColor: c.hex, borderColor: isActive ? c.hex : 'transparent' }}
                  aria-label={`Select ${c.name} color`}
                >
                  {isActive && (
                    <span className={`material-symbols-outlined text-sm font-bold ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`}>
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>


      </div>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto border-t border-white/5 bg-surface-dark/50 backdrop-blur-sm text-center">
        <p className="text-xs text-white/20">© 2026 LinkedOut</p>
      </div>
    </aside>
  );
};
