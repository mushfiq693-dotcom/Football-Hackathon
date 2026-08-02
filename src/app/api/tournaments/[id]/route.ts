import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { updateTournamentSchema } from '@/lib/validators/tournament';
import { slugify } from '@/lib/utils';

/**
 * GET /api/tournaments/[id]
 * Fetch a single tournament by ID.
 */
export const GET = requireAuth(async (_request, { params }) => {
  try {
    const { id } = params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[TOURNAMENT_GET_BY_ID]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * PATCH /api/tournaments/[id]
 * Update a tournament. Only Admins can perform this.
 */
export const PATCH = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateTournamentSchema.parse(body);
    
    const supabase = await createClient();

    // If name is being updated, regenerate slug
    let updatePayload: any = { ...validatedData };
    if (validatedData.name) {
      let slug = slugify(validatedData.name);
      const { data: existing } = await supabase
        .from('tournaments')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();
      
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
      updatePayload.slug = slug;
    }

    const { data, error } = await supabase
      .from('tournaments')
      .update(updatePayload)
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
    console.error('[TOURNAMENT_PATCH]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin']);

/**
 * DELETE /api/tournaments/[id]
 * Delete a tournament. Only Admins can perform this.
 */
export const DELETE = requireAuth(async (_request, { params }) => {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Check if tournament exists and is in a deletable state (e.g., 'Draft')
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Optional: Only allow deletion of Draft or Cancelled tournaments
    if (tournament.status !== 'Draft' && tournament.status !== 'Cancelled') {
      return NextResponse.json(
        { error: 'Only tournaments in Draft or Cancelled status can be deleted' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('[TOURNAMENT_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin']);
