import { create } from 'zustand';

export type UserRole = 'super_admin' | 'admin' | 'auctioneer' | 'team_owner' | 'captain' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  is_active: boolean;
}

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setProfile: (profile) =>
    set({
      profile,
      isAuthenticated: !!profile,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
