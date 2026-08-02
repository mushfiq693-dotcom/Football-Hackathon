import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { createTeamSchema } from '@/lib/validators/team';

/**
 * GET /api/teams
 * List all teams, optionally filtered by tournament_id.
 */
export const GET = requireAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournament_id');
    
    const supabase = await createClient();
    let query = supabase.from('teams').select('*, owner:profiles(id, full_name, email)');

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('[TEAMS_GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/teams
 * Create a new team. Only Admins can create teams for anyone.
 * Team Owners can register their own teams if they have the role.
 */
export const POST = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const validatedData = createTeamSchema.parse(body);
    
    const supabase = await createClient();

    // 1. Fetch tournament to get budget_per_team
    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .select('budget_per_team, status')
      .eq('id', validatedData.tournament_id)
      .single();

    if (tError || !tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Optional: Prevent team registration if tournament is already live/completed
    if (tournament.status !== 'Draft' && tournament.status !== 'Registration Open') {
      return NextResponse.json(
        { error: 'Cannot register teams for a tournament in this status' },
        { status: 400 }
      );
    }

    // 2. Insert team
    // For now, we assume the owner_id is either passed in body (for admins) or is the current user
    const ownerId = body.owner_id || user.id;

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...validatedData,
        owner_id: ownerId,
        budget_remaining: tournament.budget_per_team,
        players_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[TEAM_CREATE_DB_ERROR]', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[TEAMS_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin', 'team_owner']);
