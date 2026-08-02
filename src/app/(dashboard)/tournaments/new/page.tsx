'use client';

import { TournamentForm } from '@/components/forms/tournament-form';

export default function NewTournamentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Create Tournament</h1>
        <p className="text-muted-foreground">Set up a new tournament</p>
      </div>
      <div className="border p-6 rounded-lg bg-card">
        <TournamentForm />
      </div>
    </div>
  );
}
