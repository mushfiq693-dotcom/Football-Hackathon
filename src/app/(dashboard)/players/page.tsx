'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchPlayers() {
      const supabase = createClient();
      const { data } = await supabase.from('players').select('*');
      if (data) setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
          <p className="text-muted-foreground">Browse player pool</p>
        </div>
        {isAdmin() && (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Add Player</button>
        )}
      </div>
      {loading ? (
        <p>Loading players...</p>
      ) : (
        <div className="grid gap-2">
          {players.map((p) => (
            <div key={p.id} className="border p-4 rounded-lg">
              {p.name} - {p.category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
