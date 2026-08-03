'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Team } from '@/types/team';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [team, setTeam] = useState<Team | null>(null);
  const { isTeamOwner, isAdmin } = useAuth();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchTeam() {
      const supabase = createClient();
      const { data } = await supabase
        .from('teams')
        .select('*, players(*)')
        .eq('id', id)
        .single();
      setTeam(data);
    }
    fetchTeam();
  }, [id]);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{team.name} ({team.short_name})</h1>
        {(isAdmin() || isTeamOwner()) && (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Edit Team</button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold">Budget: ${team.budget_remaining.toLocaleString()}</h2>
        <h3 className="text-lg font-medium mt-4">Roster</h3>
        <ul className="space-y-2 mt-2">
          {team.players?.map((p) => <li key={p.id}>{p.name}</li>) || <li>No players</li>}
        </ul>
      </div>
    </div>
  );
}
