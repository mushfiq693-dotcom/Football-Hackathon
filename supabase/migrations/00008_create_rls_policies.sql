-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_logs ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES ============
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============ TOURNAMENTS ============
CREATE POLICY "Tournaments are viewable by authenticated users"
  ON tournaments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can create tournaments"
  ON tournaments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update tournaments"
  ON tournaments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete draft tournaments"
  ON tournaments FOR DELETE
  TO authenticated
  USING (
    status = 'draft'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- ============ TEAMS ============
CREATE POLICY "Teams are viewable by authenticated users"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team owners can register teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'team_owner'
    )
  );

CREATE POLICY "Team owners can update own teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

-- ============ PLAYERS ============
CREATE POLICY "Players are viewable by authenticated users"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and auctioneers can manage players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'auctioneer')
    )
  );

CREATE POLICY "Admins and auctioneers can update players"
  ON players FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'auctioneer')
    )
  );

CREATE POLICY "Admins can delete available players"
  ON players FOR DELETE
  TO authenticated
  USING (
    auction_status = 'available'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'auctioneer')
    )
  );

-- ============ AUCTIONS ============
CREATE POLICY "Auctions are viewable by authenticated users"
  ON auctions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and auctioneers can create auctions"
  ON auctions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'auctioneer')
    )
  );

CREATE POLICY "Auctioneers can update their auctions"
  ON auctions FOR UPDATE
  TO authenticated
  USING (
    auctioneer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- ============ AUCTION PLAYERS ============
CREATE POLICY "Auction players are viewable by authenticated users"
  ON auction_players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and auctioneers can manage auction players"
  ON auction_players FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'auctioneer')
    )
  );

-- ============ BIDS ============
CREATE POLICY "Bids are viewable by authenticated users"
  ON bids FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team owners can place bids"
  ON bids FOR INSERT
  TO authenticated
  WITH CHECK (
    bidder_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = bids.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- ============ AUCTION LOGS ============
CREATE POLICY "Auction logs are viewable by authenticated users"
  ON auction_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert auction logs"
  ON auction_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
