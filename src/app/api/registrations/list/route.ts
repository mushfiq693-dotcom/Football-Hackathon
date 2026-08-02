import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';

// GET /api/registrations — List registrations (Player: own, Admin: all)
export const GET = requireAuth(
  async (_request, { user }) => {
    const supabase = await createClient();
    
    let query = supabase.from('player_registrations').select('*, profiles(full_name, email)');

    // Players can only see their own
    if (user.profile.role !== 'admin' && user.profile.role !== 'super_admin') {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registrations: data || [] });
  }
);
