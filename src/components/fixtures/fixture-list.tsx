'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Fixture {
  id: string;
  home_team_id: string;
  away_team_id: string;
  venue: string | null;
  kickoff_time: string | null;
  status: string;
}

export function FixtureList({ fixtures }: { fixtures: Fixture[] }) {
  if (fixtures.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No fixtures scheduled.</div>;
  }

  return (
    <div className="grid gap-4">
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-4">
            <span className="font-semibold">{fixture.home_team_id}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-semibold">{fixture.away_team_id}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {fixture.venue || 'TBD'} • {fixture.kickoff_time ? new Date(fixture.kickoff_time).toLocaleString() : 'TBD'}
          </div>
          <span className="text-xs px-2 py-1 rounded bg-secondary capitalize">{fixture.status}</span>
        </div>
      ))}
    </div>
  );
}
