import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { profile, isLoading, isAuthenticated, reset } = useAuthStore();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    reset();
    router.push('/login');
  };

  const hasRole = (role: string) => profile?.role === role;

  const isAdmin = () => profile?.role === 'super_admin' || profile?.role === 'admin';
  const isAuctioneer = () => profile?.role === 'auctioneer' || profile?.role === 'super_admin' || profile?.role === 'admin';
  const isCaptain = () => profile?.role === 'team_owner' || profile?.role === 'captain';
  const isTeamOwner = isCaptain;

  return {
    profile,
    isLoading,
    isAuthenticated,
    signOut,
    hasRole,
    isAdmin,
    isAuctioneer,
    isCaptain,
    isTeamOwner,
  };
}
