import { NextResponse, type NextRequest } from 'next/server';
import { AuthenticatedUser, requireAuth } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateEventSchema } from '@/lib/validators/event';

// PATCH /api/admin/events/[id] — Update event (Admin only)
export const PATCH = requireAuth(
  async (request,
    {
      user,
      params,
    } : {
      user: AuthenticatedUser;
      params: Record<string, string>;
    } ) => {
    const { id } = await params;
    const body = await request.json();
    const validation = updateEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { data: event, error } = await adminSupabase
      .from('events')
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event });
  },
  ['admin', 'super_admin']
);

// DELETE /api/admin/events/[id] — Delete event (Admin only)
export const DELETE = requireAuth(
  async (
    request,
    {
      user,
      params,
    }: {
      user: AuthenticatedUser;
      params: Record<string, string>;
    }
  ) => {
    const { id } = await params;
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  },
  ['admin', 'super_admin']
);
