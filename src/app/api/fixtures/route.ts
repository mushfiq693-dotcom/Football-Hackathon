import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const createFixtureSchema = z.object({
  tournament_id: z.string().uuid(),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  venue: z.string().optional(),
  kickoff_time: z.string().datetime().optional(),
});

export const POST = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const validatedData = createFixtureSchema.parse(body);

    const supabase = await createClient();

    // Only Admins can create fixtures
    if (user.profile.role !== 'admin' && user.profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('fixtures')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['admin', 'super_admin']);

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const tournament_id = searchParams.get('tournament_id');

  const supabase = await createClient();
  let query = supabase.from('fixtures').select('*');

  if (tournament_id) {
    query = query.eq('tournament_id', tournament_id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data);
};
