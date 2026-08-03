-- Function to handle finalization of an auction item
CREATE OR REPLACE FUNCTION finalize_auction_bid(
  p_auction_id UUID,
  p_player_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_highest_bid_id UUID;
  v_team_id UUID;
  v_amount BIGINT;
BEGIN
  -- 1. Find the highest bid for this player
  SELECT id, team_id, amount
  INTO v_highest_bid_id, v_team_id, v_amount
  FROM bids
  WHERE auction_id = p_auction_id AND player_id = p_player_id
  ORDER BY amount DESC
  LIMIT 1;

  IF v_highest_bid_id IS NULL THEN
    -- No bids? Maybe mark as unsold or handle accordingly
    RETURN;
  END IF;

  -- 2. Update Player: Assign to team
  UPDATE players
  SET sold_to_team_id = v_team_id,
      sold_price = v_amount,
      sold_at = now(),
      auction_status = 'sold'
  WHERE id = p_player_id;

  -- 3. Deduct Budget from Team
  UPDATE teams
  SET budget_remaining = budget_remaining - v_amount,
      players_count = players_count + 1
  WHERE id = v_team_id;

  -- 4. Log the transaction
  INSERT INTO auction_logs (auction_id, event_type, payload)
  VALUES (p_auction_id, 'player_sold', jsonb_build_object(
    'player_id', p_player_id,
    'team_id', v_team_id,
    'amount', v_amount
  ));

  -- 5. Move next player logic (handled by client or another trigger)
END;
$$ LANGUAGE plpgsql;
