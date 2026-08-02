'use client';

import { useAuctionStore } from '@/stores/auction-store';
import { useAuctionRealtime } from '@/hooks/use-realtime-auction';

export function AuctionDashboard({ auctionId }: { auctionId: string }) {
  useAuctionRealtime(auctionId);
  const { currentPlayer, auctionStatus, onlineUsers } = useAuctionStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Player (Main Focus) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Current Player ({auctionStatus || '...'})
          </h2>
          {currentPlayer ? (
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                ⚽
              </div>
              <div>
                <h1 className="text-4xl font-bold">{currentPlayer.name}</h1>
                <p className="text-xl text-emerald-400 font-semibold mt-1">
                  Base: ${currentPlayer.base_price.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No active player.
            </div>
          )}
          
          {/* Admin Controls - placeholder */}
          <div className="mt-8 flex gap-3">
            {/* ... buttons ... */}
          </div>
        </div>
      </div>

      {/* Sidebar: Queue & Online Users */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Online ({onlineUsers.length})</h3>
          <div className="text-sm text-muted-foreground">
            {onlineUsers.map(u => u.user_id).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}
