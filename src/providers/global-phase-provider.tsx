'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useGlobalStore, GlobalPhase } from '@/stores/global-store';

export function GlobalPhaseProvider({ children }: { children: React.ReactNode }) {
  const setPhase = useGlobalStore((s) => s.setPhase);

  useEffect(() => {
    const supabase = createClient();

    // 1. Fetch initial phase
    const getInitialPhase = async () => {
      const { data } = await supabase
        .from('global_config')
        .select('current_phase')
        .single();
      
      if (data) {
        setPhase(data.current_phase as GlobalPhase);
      }
    };

    getInitialPhase();

    // 2. Subscribe to Realtime updates (using Postgres Changes on the table)
    const channel = supabase
      .channel('global_phase_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'global_config' },
        (payload) => {
          setPhase(payload.new.current_phase as GlobalPhase);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setPhase]);

  return <>{children}</>;
}
