import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { updateTeamSchema } from '@/lib/validators/team';

/**
 * GET /api/teams/[id]
 * Fetch a single team with its owner and roster.
 */
export const GET = requireAuth(async (_request, { params }) => {
  try {
    const { id } = params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        owner:profiles(id, full_name, email),
        tournament:tournaments(id, name, status),
        players:players(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[TEAM_GET_BY_ID]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * PATCH /api/teams/[id]
 * Update team details. Only Admins or the Team Owner can perform this.
 */
export const PATCH = requireAuth(async (request, { params, user }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateTeamSchema.parse(body);
    
    const supabase = await createClient();

    // 1. Check permissions (Admin or Owner)
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (fetchError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.owner_id === user.id;
    const isAdmin = user.profile.role === 'admin' || user.profile.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this team' },
        { status: 403 }
      );
    }

    // Restrict sensitive field updates to admins
    if ((validatedData.owner_id || validatedData.budget_remaining !== undefined) && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can update owner or budget' },
        { status: 403 }
      );
    }

    // 2. Perform update
    const { data, error } = await supabase
      .from('teams')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[TEAM_PATCH]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin', 'team_owner']);

/**
 * DELETE /api/teams/[id]
 * Delete a team. Only Admins can perform this.
 */
export const DELETE = requireAuth(async (_request, { params }) => {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Check if team has any players before deleting
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('players_count')
      .eq('id', id)
      .single();

    if (fetchError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.players_count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete team with assigned players' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('[TEAM_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin']);
