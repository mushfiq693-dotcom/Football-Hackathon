import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const placeBidSchema = z.object({
  auction_id: z.string().uuid(),
  player_id: z.string().uuid(),
  team_id: z.string().uuid(),
  amount: z.number().int().positive(),
});

export const POST = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const { auction_id, player_id, team_id, amount } = placeBidSchema.parse(body);

    const supabase = await createClient();

    // 1. Get current auction and player state
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*, min_bid_increment')
      .eq('id', auction_id)
      .single();

    if (auctionError || !auction || auction.current_player_id !== player_id) {
      return NextResponse.json({ error: 'Invalid auction or player' }, { status: 400 });
    }

    // 2. Get current highest bid
    const { data: highestBid } = await supabase
      .from('bids')
      .select('amount, team_id')
      .eq('auction_id', auction_id)
      .eq('player_id', player_id)
      .order('amount', { ascending: false })
      .limit(1)
      .single();

    // 3. Validation
    const minAmount = (highestBid?.amount || 0) + auction.min_bid_increment;
    if (amount < minAmount) {
      return NextResponse.json({ error: `Bid must be at least ${minAmount}` }, { status: 400 });
    }

    // 4. Budget check
    const { data: team } = await supabase
      .from('teams')
      .select('budget_remaining')
      .eq('id', team_id)
      .single();

    if (!team || team.budget_remaining < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // 5. Insert Bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id,
        player_id,
        team_id,
        bidder_id: user.id,
        amount,
        bid_number: (highestBid?.amount ? 1 : 0) + 1, // Simplified bid numbering
      })
      .select()
      .single();

    if (bidError) return NextResponse.json({ error: bidError.message }, { status: 400 });

    // 6. Broadcast via Realtime
    await supabase.channel(`auction:${auction_id}`).send({
      type: 'broadcast',
      event: 'bid_placed',
      payload: bid,
    });

    return NextResponse.json(bid);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['captain', 'team_owner', 'admin', 'super_admin']);
