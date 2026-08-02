-- 1. Create global_phase enum
CREATE TYPE global_phase AS ENUM (
  'Configuration', 
  'Registration', 
  'Auction', 
  'Tournament', 
  'Completed'
);

-- 2. Create global_config table (singleton)
CREATE TABLE global_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  current_phase global_phase NOT NULL DEFAULT 'Configuration',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT one_row_only CHECK (id = TRUE)
);

-- Initialize with default row
INSERT INTO global_config (id, current_phase) VALUES (TRUE, 'Configuration');

-- 3. Enable RLS
ALTER TABLE global_config ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Everyone can view global config"
  ON global_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can update global config"
  ON global_config FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- 5. RPC function to update phase and notify
CREATE OR REPLACE FUNCTION update_global_phase(new_phase global_phase)
RETURNS void AS $$
BEGIN
  UPDATE global_config
  SET current_phase = new_phase,
      updated_at = now()
  WHERE id = TRUE;

  -- Broadcast update via Realtime
  PERFORM pg_notify('global_phase_updates', json_build_object('phase', new_phase)::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
