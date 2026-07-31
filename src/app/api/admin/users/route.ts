import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['super_admin', 'admin', 'auctioneer', 'team_owner', 'captain', 'viewer']),
});

// GET /api/admin/users — List all user profiles (Admin only)
export const GET = requireAuth(
  async () => {
    const adminSupabase = createAdminClient();
    const { data: profiles, error } = await adminSupabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: profiles });
  },
  ['admin', 'super_admin']
);

// PATCH /api/admin/users — Update user role (Admin only)
export const PATCH = requireAuth(
  async (request: NextRequest) => {
    const body = await request.json();
    const validation = updateRoleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;
    const adminSupabase = createAdminClient();

    const { data: updatedProfile, error } = await adminSupabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to '${role}' successfully`,
      profile: updatedProfile,
    });
  },
  ['admin', 'super_admin']
);
