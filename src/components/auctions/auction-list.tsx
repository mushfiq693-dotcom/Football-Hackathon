'use client';

import { Auction } from '@/types/auction';
import Link from 'next/link';

interface AuctionListProps {
  auctions: Auction[];
}

export function AuctionList({ auctions }: AuctionListProps) {
  if (!auctions || auctions.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No auctions found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {auctions.map((auction) => (
        <Link 
          key={auction.id} 
          href={`/auctions/${auction.id}`}
          className="block group rounded-lg border border-border bg-card p-5 hover:bg-card/80 transition"
        >
          <h3 className="font-semibold text-lg">{auction.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{auction.description || 'No description'}</p>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground capitalize">{auction.status}</span>
            <span className="font-medium">Round {auction.round_number}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
