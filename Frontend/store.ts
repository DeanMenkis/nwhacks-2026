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
  qrCodeLink: '',
  color: '#784e97', // Default primary purple
  fontColor: '#FFFFFF', // Default white
  filletRadius: 3, // Default 3mm fillet
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setGithub: (github) => set({ github }),
  setLinkedin: (linkedin) => set({ linkedin }),
  setShowQrCode: (showQrCode) => set({ showQrCode }),
  setQrCodeLink: (qrCodeLink) => set({ qrCodeLink }),
  setColor: (color) => set({ color }),
  setFontColor: (fontColor) => set({ fontColor }),
  setFilletRadius: (filletRadius) => set({ filletRadius }),
}));
