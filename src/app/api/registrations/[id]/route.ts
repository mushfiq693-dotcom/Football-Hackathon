import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { updateRegistrationSchema } from '@/lib/validators/registration';

// PATCH /api/registrations/[id] — Update registration
export const PATCH = requireAuth(
  async (request: NextRequest, { params }) => {
    const { id } = await params;
    const body = await request.json();
    const validation = updateRegistrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('player_registrations')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data });
  }
);
