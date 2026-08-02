import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuctionStore } from '@/stores/auction-store';
import { useAuth } from '@/hooks/use-auth';

export function useAuctionRealtime(auctionId: string) {
  const { profile } = useAuth();
  const store = useAuctionStore();

  useEffect(() => {
    if (!auctionId || !profile) return;

    const supabase = createClient();
    const channel = supabase.channel(`auction:${auctionId}`);

    // Subscribe to presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat() as any[];
        store.setOnlineUsers(users);
      })
      .on('broadcast', { event: 'auction_update' }, ({ payload }) => {
        if (payload.currentPlayer) store.setCurrentPlayer(payload.currentPlayer);
        if (payload.status) store.setAuctionStatus(payload.status);
        if (payload.timer !== undefined) store.setTimer(payload.timer);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'auctions', 
        filter: `id=eq.${auctionId}` 
      }, (payload) => {
        // Handle DB changes if needed
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: profile.id,
            role: profile.role,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, profile]);
}
