import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { createEventSchema } from '@/lib/validators/event';

// GET /api/admin/events — List all events (Admin only)
export const GET = requireAuth(
  async () => {
    const adminSupabase = createAdminClient();
    const { data: events, error } = await adminSupabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events });
  },
  ['admin', 'super_admin']
);

// POST /api/admin/events — Create a new event (Admin only)
export const POST = requireAuth(
  async (request: NextRequest, { user }) => {
    const body = await request.json();
    const validation = createEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { data: event, error } = await adminSupabase
      .from('events')
      .insert({
        ...validation.data,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event }, { status: 201 });
  },
  ['admin', 'super_admin']
);
