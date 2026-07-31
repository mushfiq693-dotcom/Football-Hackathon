-- Teams table

CREATE TABLE teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL,
  logo_url        TEXT,
  color_primary   TEXT,
  color_secondary TEXT,
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  budget_remaining BIGINT NOT NULL,
  players_count   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(tournament_id, name),
  UNIQUE(tournament_id, owner_id)
);

CREATE INDEX idx_teams_tournament ON teams(tournament_id);
CREATE INDEX idx_teams_owner ON teams(owner_id);

CREATE TRIGGER set_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
