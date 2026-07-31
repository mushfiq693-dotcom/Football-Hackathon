-- Database functions for atomic operations

-- Place bid function (atomic, prevents race conditions)
CREATE OR REPLACE FUNCTION place_bid(
  p_auction_id UUID,
  p_player_id UUID,
  p_team_id UUID,
  p_bidder_id UUID,
  p_amount BIGINT
)
RETURNS JSON AS $$
DECLARE
  v_auction RECORD;
  v_team RECORD;
  v_current_highest BIGINT;
  v_bid_number INT;
  v_new_bid_id UUID;
BEGIN
  -- Lock the auction row to prevent concurrent modifications
  SELECT * INTO v_auction
  FROM auctions
  WHERE id = p_auction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Auction not found');
  END IF;

  IF v_auction.status != 'live' THEN
    RETURN json_build_object('success', false, 'error', 'Auction is not live');
  END IF;

  IF v_auction.current_player_id != p_player_id THEN
    RETURN json_build_object('success', false, 'error', 'This player is not currently up for bidding');
  END IF;

  -- Check team budget
  SELECT * INTO v_team
  FROM teams
  WHERE id = p_team_id
  FOR UPDATE;

  IF v_team.owner_id != p_bidder_id THEN
    RETURN json_build_object('success', false, 'error', 'You do not own this team');
  END IF;

  IF v_team.budget_remaining < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient budget');
  END IF;

  -- Get current highest bid
  SELECT COALESCE(MAX(amount), 0) INTO v_current_highest
  FROM bids
  WHERE auction_id = p_auction_id
  AND player_id = p_player_id
  AND status = 'active';

  -- If no bids yet, check against base price
  IF v_current_highest = 0 THEN
    SELECT base_price INTO v_current_highest
    FROM players
    WHERE id = p_player_id;

    IF p_amount < v_current_highest THEN
      RETURN json_build_object('success', false, 'error', 'Bid must be at least the base price');
    END IF;
  ELSE
    IF p_amount < v_current_highest + v_auction.min_bid_increment THEN
      RETURN json_build_object('success', false, 'error',
        format('Bid must be at least %s (current: %s + increment: %s)',
          v_current_highest + v_auction.min_bid_increment,
          v_current_highest,
          v_auction.min_bid_increment
        )
      );
    END IF;
  END IF;

  -- Get next bid number
  SELECT COALESCE(MAX(bid_number), 0) + 1 INTO v_bid_number
  FROM bids
  WHERE auction_id = p_auction_id
  AND player_id = p_player_id;

  -- Mark previous active bids as outbid
  UPDATE bids
  SET status = 'outbid'
  WHERE auction_id = p_auction_id
  AND player_id = p_player_id
  AND status = 'active';

  -- Insert new bid
  INSERT INTO bids (auction_id, player_id, team_id, bidder_id, amount, status, bid_number)
  VALUES (p_auction_id, p_player_id, p_team_id, p_bidder_id, p_amount, 'active', v_bid_number)
  RETURNING id INTO v_new_bid_id;

  -- Log the bid
  INSERT INTO auction_logs (auction_id, event_type, payload, performed_by)
  VALUES (
    p_auction_id,
    'bid_placed',
    json_build_object(
      'bid_id', v_new_bid_id,
      'player_id', p_player_id,
      'team_id', p_team_id,
      'amount', p_amount,
      'bid_number', v_bid_number
    ),
    p_bidder_id
  );

  RETURN json_build_object(
    'success', true,
    'bid_id', v_new_bid_id,
    'bid_number', v_bid_number,
    'amount', p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Confirm sale function
CREATE OR REPLACE FUNCTION confirm_sale(
  p_auction_id UUID,
  p_player_id UUID,
  p_auctioneer_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_auction RECORD;
  v_winning_bid RECORD;
BEGIN
  -- Verify auctioneer
  SELECT * INTO v_auction
  FROM auctions
  WHERE id = p_auction_id
  FOR UPDATE;

  IF v_auction.auctioneer_id != p_auctioneer_id THEN
    -- Check if super_admin
    IF NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = p_auctioneer_id AND role = 'super_admin'
    ) THEN
      RETURN json_build_object('success', false, 'error', 'Not authorized');
    END IF;
  END IF;

  -- Get winning bid
  SELECT * INTO v_winning_bid
  FROM bids
  WHERE auction_id = p_auction_id
  AND player_id = p_player_id
  AND status = 'active'
  ORDER BY amount DESC
  LIMIT 1;

  IF NOT FOUND THEN
    -- No bids, mark as unsold
    UPDATE players
    SET auction_status = 'unsold', updated_at = now()
    WHERE id = p_player_id;

    UPDATE auction_players
    SET status = 'unsold'
    WHERE auction_id = p_auction_id AND player_id = p_player_id;

    INSERT INTO auction_logs (auction_id, event_type, payload, performed_by)
    VALUES (p_auction_id, 'player_unsold', json_build_object('player_id', p_player_id), p_auctioneer_id);

    RETURN json_build_object('success', true, 'sold', false);
  END IF;

  -- Mark bid as won
  UPDATE bids SET status = 'won' WHERE id = v_winning_bid.id;

  -- Update player
  UPDATE players
  SET auction_status = 'sold',
      sold_to_team_id = v_winning_bid.team_id,
      sold_price = v_winning_bid.amount,
      sold_at = now(),
      updated_at = now()
  WHERE id = p_player_id;

  -- Update team budget and player count
  UPDATE teams
  SET budget_remaining = budget_remaining - v_winning_bid.amount,
      players_count = players_count + 1,
      updated_at = now()
  WHERE id = v_winning_bid.team_id;

  -- Update auction player status
  UPDATE auction_players
  SET status = 'sold'
  WHERE auction_id = p_auction_id AND player_id = p_player_id;

  -- Clear current player from auction
  UPDATE auctions
  SET current_player_id = NULL, updated_at = now()
  WHERE id = p_auction_id;

  -- Log the sale
  INSERT INTO auction_logs (auction_id, event_type, payload, performed_by)
  VALUES (
    p_auction_id,
    'player_sold',
    json_build_object(
      'player_id', p_player_id,
      'team_id', v_winning_bid.team_id,
      'amount', v_winning_bid.amount,
      'bid_id', v_winning_bid.id
    ),
    p_auctioneer_id
  );

  RETURN json_build_object(
    'success', true,
    'sold', true,
    'team_id', v_winning_bid.team_id,
    'amount', v_winning_bid.amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
