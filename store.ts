import { create } from 'zustand';
import { CardState } from './types';

export const useCardStore = create<CardState>((set) => ({
  name: 'Alex Maker',
  email: 'alex@print.studio',
  jobTitle: 'Prototyper',
  color: '#784e97', // Default primary purple
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setColor: (color) => set({ color }),
}));
