import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const addPlayersSchema = z.object({
  player_ids: z.array(z.string().uuid()),
});

export const POST = requireAuth(async (request, { params, user }) => {
  try {
    const { id: auction_id } = await params;
    const body = await request.json();
    const { player_ids } = addPlayersSchema.parse(body);

    const supabase = await createClient();

    // Only Admins or Auctioneers can add players
    if (user.profile.role !== 'admin' && user.profile.role !== 'super_admin' && user.profile.role !== 'auctioneer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('auction_players')
      .insert(player_ids.map((player_id, index) => ({
        auction_id,
        player_id,
        sort_order: index,
      })));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Players added to auction' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['admin', 'super_admin', 'auctioneer']);
