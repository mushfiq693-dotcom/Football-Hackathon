'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Auction } from '@/types/auction';
import { AuctionList } from '@/components/auctions/auction-list';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      const supabase = createClient();
      const { data, error } = await supabase.from('auctions').select('*');
      if (!error && data) {
        setAuctions(data);
      }
      setLoading(false);
    }
    fetchAuctions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auctions</h1>
          <p className="text-muted-foreground">Manage auction sessions</p>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading auctions...</div>
      ) : (
        <AuctionList auctions={auctions} />
      )}
    </div>
  );
}
