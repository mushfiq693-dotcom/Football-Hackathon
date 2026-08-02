'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Team } from '@/types/team';
import { TeamList } from '@/components/teams/team-list';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const supabase = createClient();
      const { data, error } = await supabase.from('teams').select('*');
      if (!error && data) {
        setTeams(data);
      }
      setLoading(false);
    }
    fetchTeams();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Registered teams</p>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading teams...</div>
      ) : (
        <TeamList teams={teams} />
      )}
    </div>
  );
}
