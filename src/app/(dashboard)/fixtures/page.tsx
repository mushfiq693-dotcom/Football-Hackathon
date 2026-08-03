'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FixtureList } from '@/components/fixtures/fixture-list';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      const res = await fetch('/api/fixtures');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFixtures(data);
      }
      setLoading(false);
    }
    fetchFixtures();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fixtures</h1>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading fixtures...</div>
      ) : (
        <FixtureList fixtures={fixtures} />
      )}
    </div>
  );
}
