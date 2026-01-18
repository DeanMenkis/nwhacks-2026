import React from 'react';
import { Link } from 'react-router-dom';
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
  const {
    name, email, jobTitle, phoneNumber, github, linkedin, showQrCode, qrCodeLink, color,
    setName, setEmail, setJobTitle, setPhoneNumber, setGithub, setLinkedin, setShowQrCode, setQrCodeLink, setColor
  } = useCardStore();

  return (
    <aside className="w-[360px] h-full bg-surface-dark border-r border-white/5 flex flex-col z-20 shadow-2xl overflow-y-auto shrink-0 relative">
      <div className="pt-6 px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-2"
        >
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </Link>
      </div>

      {/* Header */}
      <div className="px-8 py-2 pb-4">
        <div className="flex items-center gap-3 text-white mb-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
            <span className="material-symbols-outlined text-xl">view_in_ar</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">LinkedOut</h1>
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
          label="Bio"
          icon="work"
          placeholder="Electrical Engineering @ BCIT"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <InputGroup
          label="Phone Number"
          icon="call"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <InputGroup
          label="Github"
          icon="code"
          placeholder="github.com/username"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />

        <InputGroup
          label="Linkedin"
          icon="share"
          placeholder="linkedin.com/in/username"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />

        {/* QR Code Toggle */}
        <div className="px-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={showQrCode}
                onChange={(e) => setShowQrCode(e.target.checked)}
              />
              <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full transition-colors peer-checked:bg-primary" />
              <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
            </div>
            <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">Include QR Code</span>
          </label>

          {showQrCode && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <InputGroup
                label="QR Link"
                icon="qr_code"
                placeholder="https://your-portfolio.com"
                value={qrCodeLink}
                onChange={(e) => setQrCodeLink(e.target.value)}
              />
            </div>
          )}
        </div>

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
