'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [player, setPlayer] = useState<any>(null);
  const { isAdmin } = useAuth();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchPlayer() {
      const supabase = createClient();
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();
      setPlayer(data);
    }
    fetchPlayer();
  }, [id]);

  if (!player) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{player.name}</h1>
        {isAdmin() && (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Edit Player</button>
        )}
      </div>
      <p>Category: {player.category}</p>
      <p>Base Price: ${player.base_price.toLocaleString()}</p>
    </div>
  );
}
