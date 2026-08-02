-- 1. Create registration_status enum
CREATE TYPE registration_status AS ENUM (
  'pending', 
  'approved', 
  'rejected', 
  'withdrawn'
);

-- 2. Create position enum
CREATE TYPE player_position AS ENUM (
  'goalkeeper', 
  'defender', 
  'midfielder', 
  'striker'
);

-- 3. Create preferred_foot enum
CREATE TYPE preferred_foot AS ENUM (
  'left', 
  'right', 
  'both'
);

-- 4. Create player_registrations table
CREATE TABLE player_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  status          registration_status NOT NULL DEFAULT 'pending',
  
  -- Registration details
  photo_url       TEXT,
  department      TEXT NOT NULL,
  session         TEXT NOT NULL,
  position        player_position NOT NULL,
  jersey_number   INT NOT NULL,
  preferred_foot  preferred_foot NOT NULL,
  phone           TEXT NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Prevent multiple registrations for the same tournament
  UNIQUE(user_id, tournament_id)
);

-- 5. Indexes
CREATE INDEX idx_player_registrations_status ON player_registrations(status);
CREATE INDEX idx_player_registrations_tournament ON player_registrations(tournament_id);

-- 6. Enable RLS
ALTER TABLE player_registrations ENABLE ROW LEVEL SECURITY;

-- 7. Policies
CREATE POLICY "Players can view their own registrations"
  ON player_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations"
  ON player_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Players can create their own registration"
  ON player_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Players can update their own pending registration"
  ON player_registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update registration status"
  ON player_registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_player_registrations_updated_at
  BEFORE UPDATE ON player_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
