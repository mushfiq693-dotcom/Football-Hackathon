'use client';

import { use } from 'react';

export default function LiveAuctionPage({
  params,
}: {
  params: Promise<{ auctionId: string }>;
}) {
  const { auctionId } = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔴 Live Auction</h1>
        <p className="text-muted-foreground">Auction ID: {auctionId}</p>
      </div>
      {/* AuctionRoom component will go here */}
    </div>
  );
}
