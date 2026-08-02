import { create } from 'zustand';

export type GlobalPhase = 'Configuration' | 'Registration' | 'Auction' | 'Tournament' | 'Completed';

interface GlobalState {
  currentPhase: GlobalPhase;
  setPhase: (phase: GlobalPhase) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  currentPhase: 'Configuration',
  setPhase: (currentPhase) => set({ currentPhase }),
}));
