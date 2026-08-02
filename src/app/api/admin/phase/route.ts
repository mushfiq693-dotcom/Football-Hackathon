import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const phaseSchema = z.enum(['Configuration', 'Registration', 'Auction', 'Tournament', 'Completed']);

// POST /api/admin/phase — Update global phase (Super Admin only)
export const POST = requireAuth(
  async (request: NextRequest) => {
    const body = await request.json();
    const validation = phaseSchema.safeParse(body.phase);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid phase' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase.rpc('update_global_phase', {
      new_phase: validation.data,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, phase: validation.data });
  },
  ['super_admin']
);
