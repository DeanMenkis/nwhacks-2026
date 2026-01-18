import { create } from 'zustand';
import { CardState } from './types';

export const useCardStore = create<CardState>((set) => ({
  name: '',
  email: '',
  jobTitle: '',
  phoneNumber: '',
  github: '',
  linkedin: '',
  showQrCode: false,
  showGithub: false,
  showLinkedin: false,
  qrCodeLink: '',
  color: '#784e97', // Default primary purple
  fontColor: '#FFFFFF', // Default white
  font: 'https://cdn.jsdelivr.net/gh/IdreesInc/Monocraft@main/dist/Monocraft-ttf/Monocraft.ttf', // Default Monocraft
  filletRadius: 3, // Default 3mm fillet
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setGithub: (github) => set({ github }),
  setLinkedin: (linkedin) => set({ linkedin }),
  setShowQrCode: (showQrCode) => set({ showQrCode }),
  setShowGithub: (showGithub) => set({ showGithub }),
  setShowLinkedin: (showLinkedin) => set({ showLinkedin }),
  setQrCodeLink: (qrCodeLink) => set({ qrCodeLink }),
  setColor: (color) => set({ color }),
  setFontColor: (fontColor) => set({ fontColor }),
  setFont: (font) => set({ font }),
  setFilletRadius: (filletRadius) => set({ filletRadius }),
}));
