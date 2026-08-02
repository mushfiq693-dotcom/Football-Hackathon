'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments', {
      credentials: 'include',
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch tournaments (Status: ${res.status})`);
        }
        const data = await res.json();
        setTournaments(data.tournaments);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch tournaments error:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tournaments</h1>
          <p className="text-muted-foreground">Manage your tournaments</p>
        </div>
        <Link href="/tournaments/new" className="p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
          Create Tournament
        </Link>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((t: any) => (
            <div key={t.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{t.name}</h2>
                <p className="text-sm text-muted-foreground">{t.status}</p>
              </div>
              <Link href={`/tournaments/${t.id}`} className="text-sm text-emerald-400">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
