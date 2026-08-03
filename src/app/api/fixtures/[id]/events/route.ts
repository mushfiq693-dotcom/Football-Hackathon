import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const eventSchema = z.object({
  event_type: z.enum(['goal', 'yellow_card', 'red_card']),
  player_id: z.string().uuid().optional(),
  team_id: z.string().uuid(),
  minute: z.number().int().min(0),
});

export const POST = requireAuth(async (request, { params }) => {
  try {
    const { id: fixture_id } = await params;
    const body = await request.json();
    const { event_type, player_id, team_id, minute } = eventSchema.parse(body);

    const supabase = await createClient();

    // 1. Insert event
    const { data, error } = await supabase
      .from('match_events')
      .insert({ fixture_id, event_type, player_id, team_id, minute })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // 2. Update score if goal
    if (event_type === 'goal') {
      const { data: fixture } = await supabase.from('fixtures').select('home_team_id, home_score, away_score').eq('id', fixture_id).single();
      if (fixture) {
        const isHome = team_id === fixture.home_team_id;
        await supabase
          .from('fixtures')
          .update(isHome ? { home_score: fixture.home_score + 1 } : { away_score: fixture.away_score + 1 })
          .eq('id', fixture_id);
      }
    }

    // 3. Broadcast update
    await supabase.channel(`fixture:${fixture_id}`).send({
      type: 'broadcast',
      event: 'match_event',
      payload: data,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['admin', 'super_admin']);
