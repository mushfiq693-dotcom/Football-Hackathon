'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuctionStore } from '@/stores/auction-store';
import type { Bid } from '@/types/auction';

export function useRealtimeAuction(auctionId: string | null) {
  const {
    setAuctionStatus,
    setCurrentPlayer,
    addBid,
    setTimer,
    setOnlineUsers,
  } = useAuctionStore();

  useEffect(() => {
    if (!auctionId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`auction:${auctionId}`)
      // Listen for new bids
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          addBid(payload.new as Bid);
        }
      )
      // Listen for auction status changes
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          const updated = payload.new as Record<string, unknown>;
          if (updated.status) {
            setAuctionStatus(
              updated.status as ReturnType<typeof useAuctionStore.getState>['auctionStatus']
            );
          }
          if (updated.current_player_id === null) {
            setCurrentPlayer(null);
          }
        }
      )
      // Timer ticks from auctioneer
      .on('broadcast', { event: 'timer_tick' }, ({ payload }) => {
        setTimer(payload.seconds as number);
      })
      // Presence tracking
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceState = channel.presenceState();
          const users = (Object.values(presenceState).flat() as unknown) as Array<{
            user_id: string;
            role: string;
          }>;
          setOnlineUsers(users);
        }
      });

    // Listen for presence sync
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const users = (Object.values(presenceState).flat() as unknown) as Array<{
        user_id: string;
        role: string;
      }>;
      setOnlineUsers(users);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, setAuctionStatus, setCurrentPlayer, addBid, setTimer, setOnlineUsers]);
}
