'use client';

import { useEffect, useState } from 'react';
import { PointsTable } from '@/components/tournaments/points-table';

export default function TournamentStandingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      const { id } = await params;
      const res = await fetch(`/api/tournaments/${id}/standings`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStandings(data);
      }
      setLoading(false);
    }
    fetchStandings();
  }, [params]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Standings</h1>
      {loading ? (
        <div className="text-center py-10">Loading standings...</div>
      ) : (
        <PointsTable standings={standings} />
      )}
    </div>
  );
}
