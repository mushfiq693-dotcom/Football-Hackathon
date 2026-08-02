import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { registrationSchema } from '@/lib/validators/registration';

// POST /api/registrations — Register a player (Player only)
export const POST = requireAuth(
  async (request: NextRequest, { user }) => {
    const body = await request.json();
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('player_registrations')
      .insert({
        ...validation.data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Registration API Error:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data }, { status: 201 });
  }
);
