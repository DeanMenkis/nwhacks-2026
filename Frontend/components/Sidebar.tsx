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
        
        {/* User Section Header */}
        <div className="px-4">
          <h3 className="text-white text-lg font-bold leading-tight">User Details</h3>
          <p className="text-white/40 text-sm mt-1">Configure your maker profile.</p>
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

        {/* Quality Settings */}
        <div className="px-4 pt-4">
          <h3 className="text-white text-lg font-bold leading-tight mb-4">Print Quality</h3>
          <div className="flex bg-input-bg p-1 rounded-xl border border-input-border">
            <button className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-primary shadow-sm transition-all">0.1mm</button>
            <button className="flex-1 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">0.2mm</button>
            <button className="flex-1 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">0.3mm</button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto border-t border-white/5 bg-surface-dark/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/10" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANsuY7aYSAKLIFxIhmZO_a1CmJy78prDj9NVmnZr9Q580IY6P7wfr26Yg6Mw6tRxVJcDaQKT5y2g2dq5nZVm51cYKT9jCbSnhHVBezEBkoVN3pDRqOMQwdi7cH5278WQfTG13GBA4uA5luX4WZ6k-dSCf3mpoZ3ZN-YCbXeG5XA0dpe7kDx_rZ-tLpNH3sxE7czIViwnTY6ALeVZrLOyCfEc4_BhRKzOtK0hVuWkMxLZfzgQ53ICcJkKT4kyJnbF_XEQbDA2SiS8E")' }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{name}</span>
            <span className="text-xs text-accent-teal">Pro Member</span>
          </div>
          <button className="ml-auto text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
