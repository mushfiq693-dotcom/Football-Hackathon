'use client';

import { Team } from '@/types/team';
import Link from 'next/link';

interface TeamListProps {
  teams: Team[];
}

export function TeamList({ teams }: TeamListProps) {
  if (!teams || teams.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No teams found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <Link 
          key={team.id} 
          href={`/teams/${team.id}`}
          className="block group rounded-lg border border-border bg-card p-5 hover:bg-card/80 transition"
        >
          <div className="flex items-center gap-4">
            {team.logo_url ? (
              <img src={team.logo_url} alt={team.name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg text-primary">
                {team.short_name}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <p className="text-sm text-muted-foreground">{team.short_name}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">${team.budget_remaining.toLocaleString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
