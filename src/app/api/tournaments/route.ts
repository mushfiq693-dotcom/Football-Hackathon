import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { createTournamentSchema } from '@/lib/validators/tournament';
import { slugify } from '@/lib/utils';

/**
 * GET /api/tournaments
 * List all tournaments. Accessible by all authenticated users.
 */
export const GET = requireAuth(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('[TOURNAMENTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/tournaments
 * Create a new tournament. Only Admins can perform this.
 */
export const POST = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const validatedData = createTournamentSchema.parse(body);
    
    const supabase = await createClient();
    
    // Generate unique slug
    let slug = slugify(validatedData.name);
    const { data: existing } = await supabase
      .from('tournaments')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        ...validatedData,
        slug,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('[TOURNAMENT_CREATE_DB_ERROR]', error);
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
    console.error('[TOURNAMENTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}, ['admin', 'super_admin']);
