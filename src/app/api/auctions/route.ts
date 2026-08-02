import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const createAuctionSchema = z.object({
  tournament_id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  bid_timer_seconds: z.number().int().positive().default(15),
  min_bid_increment: z.number().int().positive().default(50000),
});

export const POST = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const { tournament_id, name, description, bid_timer_seconds, min_bid_increment } = createAuctionSchema.parse(body);

    const supabase = await createClient();

    // Only Admins or Auctioneers can create auctions
    if (user.profile.role !== 'admin' && user.profile.role !== 'super_admin' && user.profile.role !== 'auctioneer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('auctions')
      .insert({
        tournament_id,
        name,
        description,
        bid_timer_seconds,
        min_bid_increment,
        auctioneer_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['admin', 'super_admin', 'auctioneer']);
